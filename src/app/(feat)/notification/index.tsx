import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Navhost, type NavTabKey } from "@/components/navhost";
import { Header } from "@/components/ui/header";
import {
    NotificationItem,
    type NotificationType,
} from "./compoennts/notification";

export interface NotificationData {
  id: string;
  actorName: string;
  actionText: string;
  content?: string;
  avatarUrl?: string;
  time: string;
  isRead: boolean;
  type: NotificationType;
  showActions?: boolean;
}

const MOCK_FRIEND_REQUESTS: NotificationData[] = [
  {
    id: "friend-request-1",
    actorName: "Hermione Granger",
    actionText: "đã gửi cho bạn lời mời kết bạn",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    time: "5 phút trước",
    isRead: false,
    type: "friend_request",
    showActions: true,
  },
  {
    id: "friend-request-2",
    actorName: "Ron Weasley",
    actionText: "đã gửi cho bạn lời mời kết bạn",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    time: "20 phút trước",
    isRead: false,
    type: "friend_request",
    showActions: true,
  },
];

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 16,
  },
});

/**
 * Notification Screen
 * Màn hình thông báo sử dụng NotificationItem được thiết kế dựa trên cấu trúc User Item
 */
export default function NotificationScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<NavTabKey>("inbox");
  const [notifications, setNotifications] =
    useState<NotificationData[]>(MOCK_FRIEND_REQUESTS);

  const handleAcceptFriend = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleDeclineFriend = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleNavChange = useCallback((tab: NavTabKey) => {
    setActiveTab(tab);
    if (tab === "chat") {
      router.push("/(feat)/friend-chat" as any);
    } else if (tab === "groups") {
      router.push("/(feat)/friends" as any);
    } else if (tab === "menu") {
      router.push("/(feat)/settings" as any);
    }
  }, []);

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <StatusBar style="dark" />

      {/* 1. Header */}
      <Header
        title="Lời mời kết bạn"
        avatarUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
      />

      {/* 2. Danh sách lời mời kết bạn */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <NotificationItem
            actorName={item.actorName}
            actionText={item.actionText}
            content={item.content}
            avatarUrl={item.avatarUrl}
            time={item.time}
            isRead={item.isRead}
            type={item.type}
            showActions={item.showActions}
            onAccept={() => handleAcceptFriend(item.id)}
            onDecline={() => handleDeclineFriend(item.id)}
          />
        )}
      />

      {/* 3. Thanh điều hướng Navhost dưới đáy */}
      <View style={{ paddingBottom: insets.bottom }} className="bg-white">
        <Navhost activeTab={activeTab} onTabChange={handleNavChange} />
      </View>
    </View>
  );
}
