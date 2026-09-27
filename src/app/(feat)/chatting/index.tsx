import React, { useCallback, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ChatHeader } from './components/header';
import { InputChat } from './components/input-chat';
import { MessageBubble } from './components/message';
import { MessageGroupItem } from './components/message-group-item';

// Mock dữ liệu avatar mặc định của Hermione Granger từ Figma
const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

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

// Dữ liệu hội thoại khởi tạo chính xác 100% từ thiết kế Figma (Node 13:15 / Frame "Chating" 9:2)
const INITIAL_CONVERSATION: ChatItemType[] = [
  {
    id: 'grp-1',
    type: 'sender',
    messages: [
      'Chat message',
      'Chat message',
      'dm',
      'Bồ biết không, đôi khi bồ làm mình thấy sợ thật đấy, Hermione.',
    ],
  },
  {
    id: 'grp-2',
    type: 'receiver',
    avatarUrl: DEFAULT_AVATAR,
    messages: [
      'Vì mình đã đọc xong chương cuối của cuốn Lịch sử Pháp thuật trước khi giáo sư Binns kịp giao bài á?',
    ],
  },
  {
    id: 'grp-3',
    type: 'sender',
    messages: [
      "Không, vì bồ vừa xếp lại thời gian biểu tuần tới của mình, tô màu từng môn bằng mực phát sáng, và thậm chí còn chừa ra mười lăm phút vào chiều thứ Năm cho việc 'khủng hoảng tinh thần trước trận Quidditch'.",
    ],
  },
  {
    id: 'grp-4',
    type: 'receiver',
    avatarUrl: DEFAULT_AVATAR,
    messages: [
      'Thì... bồ luôn bị căng thẳng vào chiều thứ Năm trước ngày thi đấu mà.',
      'Mình chỉ đang đảm bảo bồ có thời gian hoảng loạn một cách khoa học và có kế hoạch thôi. Hồi sáng Ron bảo mình nên chừa cho bồ hẳn ba mươi phút, nhưng mình nghĩ mười lăm phút là quá đủ để bồ đi đi lại lại quanh phòng sinh hoạt chung rồi.',
    ],
  },
  {
    id: 'grp-5',
    type: 'sender',
    messages: [
      'Cảm ơn nhé. Khoa học lắm. Thế còn lịch của Ron thì bồ ghi gì?',
    ],
  },
];

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    gap: 10,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});

/**
 * Chatting Screen (Figma node 9:2 - "Chating" & node 13:15)
 * Màn hình nhắn tin trực tiếp hoàn chỉnh theo đúng thiết kế Figma
 */
export default function ChattingScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ name?: string; avatar?: string }>();
  const scrollViewRef = useRef<ScrollView>(null);

  const friendName = (params.name as string) || 'Hermione Granger';
  const friendAvatar = (params.avatar as string) || DEFAULT_AVATAR;

  const [conversation, setConversation] =
    useState<ChatItemType[]>(INITIAL_CONVERSATION);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  // Xử lý gửi tin nhắn mới và cuộn mượt xuống đáy
  const handleSendMessage = useCallback((messageText: string) => {
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
    <View
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top }}
    >
      <StatusBar style="dark" />

      {/* 1. Header (Figma node 13:7) */}
      <ChatHeader
        title={friendName}
        status="Online"
        isOnline={true}
        onBack={handleBack}
      />

      {/* 2. Khung nội dung tin nhắn (Figma node 13:15) */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            scrollViewRef.current?.scrollToEnd({ animated: false });
          }}
        >
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

        {/* 3. Thanh nhập tin nhắn ở dưới đáy (Figma node 13:16) */}
        <View style={{ paddingBottom: Math.max(insets.bottom, 8) }}>
          <InputChat onSend={handleSendMessage} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
