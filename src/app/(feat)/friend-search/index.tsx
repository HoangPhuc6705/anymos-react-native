import { ArrowLeftIcon } from "@solar-icons/react-native/linear/arrow-left";
import { MinimalisticMagnifierIcon } from "@solar-icons/react-native/linear/minimalistic-magnifier";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AppButton from "@/components/ui/button";
import { FriendItem } from "@/components/ui/friend-item";
import AppInput from "@/components/ui/input";
import {
    searchFriendsByName,
    searchUsersByEmail,
    sendFriendRequest,
    type FriendSearchMode,
    type FriendSearchResult,
} from "@/services/friends";

const styles = StyleSheet.create({
  listContent: { paddingBottom: 24, flexGrow: 1 },
});

export default function FriendSearchScreen() {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const [mode, setMode] = useState<FriendSearchMode>("friends");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FriendSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [sentRequests, setSentRequests] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    const search =
      mode === "friends"
        ? searchFriendsByName(query)
        : searchUsersByEmail(query);
    search.then((nextResults) => {
      if (active) {
        setResults(nextResults);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [mode, query]);

  const handleSendRequest = async (userId: string) => {
    await sendFriendRequest(userId);
    setSentRequests((current) => [...current, userId]);
  };

  const renderResult = ({ item }: { item: FriendSearchResult }) => {
    const requestSent =
      sentRequests.includes(item.id) || item.relationship === "pending";

    return (
      <FriendItem
        name={item.name}
        avatarUrl={item.avatarUrl}
        isOnline={item.isOnline}
        statusColor={item.statusColor}
        statusText={mode === "email" ? item.email : item.statusText}
        onPress={() => undefined}
        rightElement={
          mode === "email" ? (
            <AppButton
              title={requestSent ? "Đã gửi" : "Kết bạn"}
              size="sm"
              variant={requestSent ? "secondary" : "default"}
              disabled={requestSent}
              onPress={() => handleSendRequest(item.id)}
            />
          ) : undefined
        }
      />
    );
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <StatusBar style="dark" />
      <View className="h-16 flex-row items-center gap-3 border-b border-[#E4E4E7]/40 px-4">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
          hitSlop={8}
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full active:bg-secondary/40"
        >
          <ArrowLeftIcon size={22} color="#09090B" />
        </Pressable>
        <Text className="font-open-sans-semibold text-xl font-semibold text-foreground">
          Tìm kiếm
        </Text>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={renderResult}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="gap-4 px-4 pb-3 pt-4">
            <AppInput
              ref={inputRef}
              autoFocus
              value={query}
              onChangeText={setQuery}
              placeholder={
                mode === "friends"
                  ? "Tìm theo tên bạn bè"
                  : "Nhập email để tìm bạn mới"
              }
              leadingIcon={<MinimalisticMagnifierIcon size={16} />}
              keyboardType={mode === "email" ? "email-address" : "default"}
              autoCapitalize="none"
            />
            <View className="flex-row rounded-full bg-[#F5F3FF] p-1">
              <Pressable
                onPress={() => setMode("friends")}
                className={`flex-1 items-center rounded-full py-2 ${mode === "friends" ? "bg-white" : ""}`}
              >
                <Text className="font-open-sans-semibold text-sm font-semibold text-foreground">
                  Bạn bè hiện có
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setMode("email")}
                className={`flex-1 items-center rounded-full py-2 ${mode === "email" ? "bg-white" : ""}`}
              >
                <Text className="font-open-sans-semibold text-sm font-semibold text-foreground">
                  Tìm bạn mới
                </Text>
              </Pressable>
            </View>
            <Text className="font-open-sans text-sm text-mute-foreground">
              {mode === "friends"
                ? "Tìm nhanh trong danh sách bạn bè của bạn"
                : "Tìm người dùng bằng địa chỉ email"}
            </Text>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View className="items-center py-12">
              <ActivityIndicator />
            </View>
          ) : (
            <View className="items-center px-8 py-12">
              <Text className="font-open-sans text-center text-mute-foreground">
                {query.trim()
                  ? "Không tìm thấy người dùng phù hợp"
                  : "Chưa có kết quả tìm kiếm"}
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}
