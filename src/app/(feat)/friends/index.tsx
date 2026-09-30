import { MinimalisticMagnifierIcon } from "@solar-icons/react-native/linear/minimalistic-magnifier";
import { router, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Navhost, type NavTabKey } from "@/components/navhost";
import { FriendItem } from "@/components/ui/friend-item";
import { Header } from "@/components/ui/header";
import AppInput from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { errorMessage, getFriends, otherUserOf } from "@/services/friends";

export interface FriendData {
  /** Id người dùng của người bạn (không phải id của bản ghi friendship) */
  id: number;
  name: string;
  avatarUrl?: string;
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 16,
    flexGrow: 1,
  },
});

/**
 * Friends List Screen (Figma node 30:268)
 * Danh sách bạn bè lấy từ API (GET /api/v1/friends), tải lại mỗi khi màn hình được focus.
 * Thanh tìm kiếm lọc theo tên ngay trên máy.
 */
export default function FriendsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const myId = user?.id;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<NavTabKey>("groups");
  const [friends, setFriends] = useState<FriendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Chỉ nhận kết quả của lần gọi mới nhất (tránh kết quả cũ ghi đè kết quả mới)
  const requestSeq = useRef(0);

  const loadFriends = useCallback(async () => {
    if (myId === undefined) return;
    const seq = ++requestSeq.current;
    try {
      const list = await getFriends();
      if (seq !== requestSeq.current) return;
      setFriends(
        list
          .map((f) => {
            // Mỗi friendship có 2 user: lấy người còn lại (không phải mình)
            const other = otherUserOf(f, myId);
            return {
              id: other.id,
              name: other.username,
              avatarUrl: other.avatarUrl ?? undefined,
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name, "vi")),
      );
      setError(null);
    } catch (err) {
      if (seq !== requestSeq.current) return;
      setError(errorMessage(err));
    } finally {
      if (seq === requestSeq.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [myId]);

  // Mỗi lần vào màn hình (kể cả quay lại từ màn hình lời mời) thì tải lại danh sách.
  useFocusEffect(
    useCallback(() => {
      loadFriends();
    }, [loadFriends]),
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadFriends();
  }, [loadFriends]);

  // Lọc danh sách bạn bè theo từ khóa tìm kiếm
  const filteredFriends = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return friends;
    return friends.filter((item) => item.name.toLowerCase().includes(query));
  }, [friends, searchQuery]);

  const handleOpenChat = useCallback((friend: FriendData) => {
    router.push({
      pathname: "/(feat)/chatting" as any,
      params: {
        name: friend.name,
        avatar: friend.avatarUrl ?? "",
        peerUserId: String(friend.id),
      },
    });
  }, []);

  const handleNavChange = useCallback((tab: NavTabKey) => {
    setActiveTab(tab);
    if (tab === "chat") {
      router.push("/(feat)/friend-chat" as any);
    } else if (tab === "inbox") {
      router.push("/(feat)/notification" as any);
    } else if (tab === "menu") {
      router.push("/(feat)/settings" as any);
    }
  }, []);

  const renderFriendItem = useCallback(
    ({ item }: { item: FriendData }) => (
      <FriendItem
        name={item.name}
        avatarUrl={item.avatarUrl}
        onPress={() => handleOpenChat(item)}
      />
    ),
    [handleOpenChat],
  );

  const renderEmpty = () => {
    if (loading) {
      return (
        <View className="items-center py-12">
          <ActivityIndicator />
        </View>
      );
    }

    if (error) {
      return (
        <View className="items-center gap-3 px-8 py-12">
          <Text className="font-open-sans text-center text-mute-foreground">
            {error}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setLoading(true);
              loadFriends();
            }}
            className="h-8 items-center justify-center rounded-full bg-[#E4E4E7] px-4 active:opacity-80"
          >
            <Text className="font-open-sans text-xs text-[#27272A]">
              Thử lại
            </Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View className="items-center px-8 py-12">
        <Text className="font-open-sans text-center text-mute-foreground">
          {searchQuery.trim()
            ? "Không tìm thấy bạn bè phù hợp"
            : "Bạn chưa có bạn bè nào"}
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <StatusBar style="dark" />

      {/* 1. Header (Figma node 30:269) */}
      <Header
        title="WhatsupApp"
        avatarUrl={user?.avatarUrl ?? undefined}
      />

      {/* 2. Danh sách bạn bè kèm Header List (Figma node 30:272) */}
      <FlatList
        data={filteredFriends}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderFriendItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={
          <View className="flex-col gap-4 pt-4 pb-2">
            {/* Thanh tìm kiếm bạn bè (Figma node 30:411 / Input 44px) */}
            <View className="px-4">
              <AppInput
                placeholder="Tìm kiếm bạn bè"
                size="default"
                value={searchQuery}
                onChangeText={setSearchQuery}
                leadingIcon={<MinimalisticMagnifierIcon size={16} />}
              />
            </View>
          </View>
        }
      />

      {/* 3. Thanh điều hướng dưới đáy (Figma node 30:290 / Navhost) */}
      <View style={{ paddingBottom: insets.bottom }} className="bg-white">
        <Navhost activeTab={activeTab} onTabChange={handleNavChange} />
      </View>
    </View>
  );
}
