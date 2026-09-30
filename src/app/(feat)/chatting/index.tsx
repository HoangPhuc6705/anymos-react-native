import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useAuth } from '@/context/auth-context';
import {
  getMessageHistory,
  sendMessage,
  subscribeToConversation,
  type ChatMessage,
} from '@/services/chat';
import { connectWebSocket, isConnected } from '@/services/websocket';

import { ChatHeader } from './components/header';
import { InputChat } from './components/input-chat';
import { MessageBubble } from './components/message';
import { MessageGroupItem } from './components/message-group-item';

// ── Types ──────────────────────────────────────────────────────────────

type ChatItemType =
  | {
      id: string;
      type: 'sender';
      messages: string[];
    }
  | {
      id: string;
      type: 'receiver';
      avatarUrl?: string;
      messages: string[];
    };

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    gap: 10,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});

// ── Helpers ────────────────────────────────────────────────────────────

/** Nhóm các tin nhắn liên tiếp cùng người gửi thành các group */
function groupMessages(
  messages: ChatMessage[],
  currentUserId: number,
  friendAvatar: string,
): ChatItemType[] {
  const groups: ChatItemType[] = [];

  for (const msg of messages) {
    const isSender = msg.senderId === currentUserId;
    const lastGroup = groups[groups.length - 1];

    if (lastGroup && lastGroup.type === (isSender ? 'sender' : 'receiver')) {
      lastGroup.messages.push(msg.content);
    } else if (isSender) {
      groups.push({
        id: `grp-${msg.id}`,
        type: 'sender',
        messages: [msg.content],
      });
    } else {
      groups.push({
        id: `grp-${msg.id}`,
        type: 'receiver',
        avatarUrl: friendAvatar,
        messages: [msg.content],
      });
    }
  }

  return groups;
}

// ── Component ──────────────────────────────────────────────────────────

/**
 * Chatting Screen — kết nối thực với backend qua REST + STOMP WebSocket.
 * - Lấy lịch sử tin nhắn qua REST API khi mount.
 * - Subscribe real-time qua STOMP để nhận tin nhắn mới.
 * - Gửi tin nhắn qua STOMP publish.
 */
export default function ChattingScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    conversationId?: string;
    name?: string;
    avatar?: string;
  }>();
  const scrollViewRef = useRef<ScrollView>(null);
  const { user } = useAuth();

  const conversationId = params.conversationId
    ? Number(params.conversationId)
    : null;
  const friendName = (params.name as string) || 'Bạn bè';
  const friendAvatar = (params.avatar as string) || '';
  const currentUserId = user?.id ?? 0;

  const [conversation, setConversation] = useState<ChatItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(isConnected());

  // Kết nối WebSocket nếu chưa
  useEffect(() => {
    if (!isConnected()) {
      connectWebSocket()
        .then(() => setWsConnected(true))
        .catch((err) => {
          if (__DEV__) console.log('[chat] ws connect error', err);
        });
    } else {
      setWsConnected(true);
    }
  }, []);

  // Tải lịch sử tin nhắn qua REST API
  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const messages = await getMessageHistory(conversationId, 50);
        if (cancelled) return;

        const groups = groupMessages(messages, currentUserId, friendAvatar);
        setConversation(groups);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        if (__DEV__) console.log('[chat] load history error', err);
        setError('Không tải được tin nhắn. Vui lòng thử lại.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [conversationId, currentUserId, friendAvatar]);

  // Subscribe tin nhắn real-time qua STOMP
  useEffect(() => {
    if (!conversationId || !wsConnected) return;

    const unsubscribe = subscribeToConversation(
      conversationId,
      (newMessage: ChatMessage) => {
        if (__DEV__) console.log('[chat] nhận tin nhắn mới:', newMessage);

        setConversation((prev) => {
          const isSender = newMessage.senderId === currentUserId;
          const lastGroup = prev[prev.length - 1];

          if (
            lastGroup &&
            lastGroup.type === (isSender ? 'sender' : 'receiver')
          ) {
            return [
              ...prev.slice(0, -1),
              {
                ...lastGroup,
                messages: [...lastGroup.messages, newMessage.content],
              },
            ];
          }

          const newGroup: ChatItemType = isSender
            ? {
                id: `grp-${newMessage.id ?? Date.now()}`,
                type: 'sender',
                messages: [newMessage.content],
              }
            : {
                id: `grp-${newMessage.id ?? Date.now()}`,
                type: 'receiver',
                avatarUrl: friendAvatar,
                messages: [newMessage.content],
              };

          return [...prev, newGroup];
        });

        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      },
    );

    return unsubscribe;
  }, [conversationId, wsConnected, currentUserId, friendAvatar]);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  // Gửi tin nhắn qua STOMP WebSocket
  const handleSendMessage = useCallback(
    (messageText: string) => {
      if (!messageText.trim() || !conversationId) return;

      sendMessage({
        conversationId,
        content: messageText.trim(),
        type: 'TEXT',
      });

      // Optimistic update: hiển thị ngay tin nhắn gửi đi
      // (sẽ được xác nhận khi server broadcast lại)
      // Bỏ optimistic update để tránh duplicate — chờ server broadcast.
    },
    [conversationId],
  );

  // ── Fallback: nếu không có conversationId (mở từ mock) ───────────

  const handleSendLocal = useCallback((messageText: string) => {
    if (!messageText.trim()) return;

    setConversation((prev) => {
      const lastItem = prev[prev.length - 1];
      if (lastItem && lastItem.type === 'sender') {
        return [
          ...prev.slice(0, -1),
          {
            ...lastItem,
            messages: [...lastItem.messages, messageText],
          },
        ];
      }
      return [
        ...prev,
        {
          id: `grp-${Date.now()}`,
          type: 'sender',
          messages: [messageText],
        },
      ];
    });

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <StatusBar style="dark" />

      {/* 1. Header */}
      <ChatHeader
        title={friendName}
        status={wsConnected ? 'Online' : 'Đang kết nối...'}
        isOnline={wsConnected}
        onBack={handleBack}
      />

      {/* 2. Nội dung tin nhắn */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
      >
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" />
            <Text className="mt-2 text-gray-500">Đang tải tin nhắn...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center px-8">
            <Text className="text-red-500 text-center">{error}</Text>
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            className="flex-1"
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => {
              scrollViewRef.current?.scrollToEnd({ animated: false });
            }}
          >
            {conversation.length === 0 && (
              <View className="flex-1 items-center justify-center">
                <Text className="text-gray-400">
                  Chưa có tin nhắn nào. Hãy gửi lời chào! 👋
                </Text>
              </View>
            )}

            {conversation.map((item) => {
              if (item.type === 'sender') {
                return (
                  <View
                    key={item.id}
                    className="w-full flex-col items-end gap-2.5"
                  >
                    {item.messages.map((msg, index) => (
                      <MessageBubble
                        key={`${item.id}-${index}`}
                        text={msg}
                        variant="primary"
                      />
                    ))}
                  </View>
                );
              }

              return (
                <View
                  key={item.id}
                  className="w-full flex-col items-start gap-2.5"
                >
                  <MessageGroupItem
                    avatarUrl={item.avatarUrl || friendAvatar}
                    messages={item.messages}
                  />
                </View>
              );
            })}
          </ScrollView>
        )}

        {/* 3. Thanh nhập tin nhắn */}
        <View style={{ paddingBottom: Math.max(insets.bottom, 8) }}>
          <InputChat
            onSend={conversationId ? handleSendMessage : handleSendLocal}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
