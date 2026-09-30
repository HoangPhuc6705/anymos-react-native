import { MinimalisticMagnifierIcon } from "@solar-icons/react-native/linear/minimalistic-magnifier";
import { router, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Navhost, type NavTabKey } from "@/components/navhost";
import { ChatItem } from "@/components/ui/chat-item";
import { Header } from "@/components/ui/header";
import AppInput from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { formatChatTime } from "@/lib/format-time";
import { ApiError } from "@/services/api";
import { listConversations } from "@/services/conversations";
import type { ConversationSummary } from "@/services/types";

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 16,
    flexGrow: 1,
  },
});

/**
 * Friend Chat Screen (Figma node 17:894 / Conversation List)
 * Danh sách cuộc trò chuyện lấy từ GET /api/v1/conversations.
 */
export default function FriendChatScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTabKey>("chat");

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true); // chỉ true ở lần tải đầu tiên
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await listConversations();
      setConversations(data);
      setError(null);
    } catch (err) {
      console.log('[chat] load lỗi', err);
      // Chưa có endpoint refresh token nên token hết hạn (15 phút) thì đăng nhập lại.
      // TODO: thay bằng tự refresh rồi gọi lại request khi backend có /auth/refresh.
      if (err instanceof ApiError && err.status === 401) {
        await signOut();
        return;
      }
      setError(
        err instanceof ApiError
          ? err.message
          : "Có lỗi xảy ra, vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  }, [signOut]);

  // Tải lại mỗi khi màn hình được focus (ví dụ quay về từ màn chat)
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const handleRetry = useCallback(() => {
    setLoading(true);
    load();
  }, [load]);

  const totalUnread = useMemo(
    () => conversations.reduce((sum, c) => sum + c.unreadCount, 0),
    [conversations],
  );

  const handleOpenChat = useCallback((c: ConversationSummary) => {
    router.push({
      pathname: "/(feat)/chatting" as any,
      params: {
        conversationId: String(c.id),
        name: c.name ?? "Cuộc trò chuyện",
        avatar: c.avatarUrl ?? undefined,
      },
    });
  }, []);

  const handleNavChange = useCallback((tab: NavTabKey) => {
    setActiveTab(tab);
    if (tab === "groups") {
      router.push("/(feat)/friends" as any);
    } else if (tab === "inbox") {
      router.push("/(feat)/notification" as any);
    } else if (tab === "menu") {
      router.push("/(feat)/settings" as any);
    }
  }, []);

  const renderEmpty = () => {
    if (loading) {
      return (
        <View className="flex-1 items-center justify-center py-16">
          <ActivityIndicator />
        </View>
      );
    }
    if (error && conversations.length === 0) {
      return (
        <View className="flex-1 items-center justify-center gap-3 px-8 py-16">
          <Text className="font-open-sans text-md text-mute-foreground text-center">
            {error}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={handleRetry}
            className="px-4 py-2 rounded-full bg-primary active:opacity-80"
          >
            <Text className="font-open-sans-semibold font-semibold text-white">
              Thử lại
            </Text>
          </Pressable>
        </View>
      );
    }
    return (
      <View className="flex-1 items-center justify-center px-8 py-16">
        <Text className="font-open-sans text-md text-mute-foreground text-center">
          Chưa có cuộc trò chuyện nào
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <StatusBar style="dark" />

      {/* 1. Header (Figma node 24:64) */}
      <Header title="WhatsupApp" avatarUrl={user?.avatarUrl ?? undefined} />

      <FlatList
        data={conversations}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={
          <View className="pt-3 pb-2 px-4">
            {/* 2. Thanh tìm kiếm (Figma node 24:135 / Input 44px) */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Tìm kiếm bạn bè"
              onPress={() => router.push("/(feat)/friend-search" as any)}
            >
              <View pointerEvents="none">
                <AppInput
                  placeholder="Tìm kiếm bạn bè"
                  size="default"
                  editable={false}
                  leadingIcon={<MinimalisticMagnifierIcon size={16} />}
                />
              </View>
            </Pressable>
          </View>
        }
        ListEmptyComponent={renderEmpty}
        renderItem={({ item }) => (
          <ChatItem
            name={item.name ?? "Cuộc trò chuyện"}
            message={item.lastMessagePreview ?? "Chưa có tin nhắn"}
            time={formatChatTime(item.lastMessageAt)}
            avatarUrl={item.avatarUrl ?? undefined}
            unreadCount={item.unreadCount}
            onPress={() => handleOpenChat(item)}
          />
        )}
      />

      {/* 4. Thanh điều hướng dưới đáy (Figma node 30:83 / Navhost) */}
      <View style={{ paddingBottom: insets.bottom }} className="bg-white">
        <Navhost
          activeTab={activeTab}
          onTabChange={handleNavChange}
          chatBadge={totalUnread}
        />
      </View>
    </View>
  );
}
