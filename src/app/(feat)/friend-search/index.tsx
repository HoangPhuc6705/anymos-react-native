import { ArrowLeftIcon } from "@solar-icons/react-native/linear/arrow-left";
import { MinimalisticMagnifierIcon } from "@solar-icons/react-native/linear/minimalistic-magnifier";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
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
import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/services/api";
import {
    acceptFriendRequest,
    errorMessage,
    getFriends,
    isValidEmail,
    otherUserOf,
    searchUsersByEmail,
    sendFriendRequest,
    type FriendRelationship,
    type FriendSearchMode,
} from "@/services/friends";
import type { AuthUser } from "@/services/types";

const styles = StyleSheet.create({
  listContent: { paddingBottom: 24, flexGrow: 1 },
});

/** Dòng hiển thị trong danh sách kết quả (dùng chung cho 2 chế độ tìm kiếm). */
interface SearchItem {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  relationship: FriendRelationship;
  friendshipId: number | null;
}

function toItem(
  u: AuthUser,
  relationship: FriendRelationship,
  friendshipId: number | null,
): SearchItem {
  return {
    id: u.id,
    name: u.username,
    email: u.email,
    avatarUrl: u.avatarUrl ?? undefined,
    relationship,
    friendshipId,
  };
}

/** Nút hành động theo quan hệ; null = không hiện nút. */
function getAction(
  relationship: FriendRelationship,
): { title: string; variant: "default" | "secondary"; disabled: boolean } | null {
  switch (relationship) {
    case "NONE":
      return { title: "Kết bạn", variant: "default", disabled: false };
    case "PENDING_SENT":
      return { title: "Đã gửi", variant: "secondary", disabled: true };
    case "PENDING_RECEIVED":
      return { title: "Chấp nhận", variant: "default", disabled: false };
    default:
      return null;
  }
}

/** Các lỗi cho thấy trạng thái đã đổi ở nơi khác → tải lại thay vì báo lỗi. */
const STALE_ERROR_CODES = [
  "REQUEST_ALREADY_SENT",
  "ALREADY_FRIENDS",
  "NOT_PENDING",
  "FRIENDSHIP_NOT_FOUND",
];

export default function FriendSearchScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const myId = user?.id;
  const inputRef = useRef<TextInput>(null);
  const [mode, setMode] = useState<FriendSearchMode>("friends");
  const [query, setQuery] = useState("");

  // Chế độ "Bạn bè hiện có": tải cả danh sách một lần rồi lọc theo tên trên máy.
  const [friends, setFriends] = useState<SearchItem[] | null>(null);
  const [friendsError, setFriendsError] = useState<string | null>(null);
  const [friendsReload, setFriendsReload] = useState(0);

  // Chế độ "Tìm bạn mới": gọi API tìm theo email (debounce).
  const [emailResults, setEmailResults] = useState<SearchItem[]>([]);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailReload, setEmailReload] = useState(0);

  const [busyId, setBusyId] = useState<number | null>(null);
  const busyRef = useRef(false);

  const trimmed = query.trim();
  const emailValid = isValidEmail(trimmed);

  useEffect(() => {
    if (mode !== "friends" || friends !== null || myId === undefined) return;
    let active = true;
    setFriendsError(null);
    getFriends()
      .then((list) => {
        if (active) {
          setFriends(
            list.map((f) => toItem(otherUserOf(f, myId), "FRIEND", f.id)),
          );
        }
      })
      .catch((err) => {
        if (active) setFriendsError(errorMessage(err));
      });
    return () => {
      active = false;
    };
  }, [mode, friends, myId, friendsReload]);

  useEffect(() => {
    if (mode !== "email") return;
    if (!emailValid) {
      setEmailResults([]);
      setEmailLoading(false);
      setEmailError(null);
      return;
    }

    let active = true;
    setEmailLoading(true);
    setEmailError(null);
    const timer = setTimeout(() => {
      searchUsersByEmail(trimmed)
        .then((data) => {
          if (active) {
            setEmailResults(
              data.map((u) => toItem(u, u.relationship, u.friendshipId)),
            );
          }
        })
        .catch((err) => {
          if (active) {
            setEmailResults([]);
            setEmailError(errorMessage(err));
          }
        })
        .finally(() => {
          if (active) setEmailLoading(false);
        });
    }, 400);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [mode, trimmed, emailValid, emailReload]);

  const loading =
    mode === "email" ? emailLoading : friends === null && !friendsError;
  const error = mode === "email" ? emailError : friendsError;

  const displayed = useMemo(() => {
    if (mode === "email") return emailValid ? emailResults : [];
    const list = friends ?? [];
    const q = trimmed.toLowerCase();
    return q ? list.filter((f) => f.name.toLowerCase().includes(q)) : list;
  }, [mode, emailValid, emailResults, friends, trimmed]);

  const patchItem = (id: number, patch: Partial<SearchItem>) => {
    setEmailResults((current) =>
      current.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    );
  };

  const handleAction = async (item: SearchItem) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusyId(item.id);
    try {
      if (item.relationship === "NONE") {
        const created = await sendFriendRequest(item.id);
        patchItem(item.id, {
          relationship: "PENDING_SENT",
          friendshipId: created.id,
        });
      } else if (
        item.relationship === "PENDING_RECEIVED" &&
        item.friendshipId !== null
      ) {
        await acceptFriendRequest(item.friendshipId);
        patchItem(item.id, { relationship: "FRIEND" });
        setFriends(null); // lần sau mở "Bạn bè hiện có" sẽ tải lại danh sách
      }
    } catch (err) {
      if (err instanceof ApiError && STALE_ERROR_CODES.includes(err.code)) {
        setEmailReload((n) => n + 1); // trạng thái đã đổi: tìm lại để cập nhật nút
      } else {
        Alert.alert("Không thể thực hiện", errorMessage(err));
      }
    } finally {
      busyRef.current = false;
      setBusyId(null);
    }
  };

  const renderResult = ({ item }: { item: SearchItem }) => {
    const action = mode === "email" ? getAction(item.relationship) : null;
    const statusText =
      mode === "email" && item.relationship === "FRIEND"
        ? "Đã là bạn bè"
        : mode === "email" && item.relationship === "PENDING_RECEIVED"
          ? "Đã gửi lời mời cho bạn"
          : item.email;

    return (
      <FriendItem
        name={item.name}
        avatarUrl={item.avatarUrl}
        statusText={statusText}
        onPress={() => undefined}
        rightElement={
          action ? (
            <AppButton
              title={action.title}
              size="sm"
              variant={action.variant}
              loading={busyId === item.id}
              disabled={action.disabled || busyId !== null}
              onPress={() => handleAction(item)}
            />
          ) : undefined
        }
      />
    );
  };

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
          <AppButton
            title="Thử lại"
            size="sm"
            variant="secondary"
            onPress={() =>
              mode === "email"
                ? setEmailReload((n) => n + 1)
                : setFriendsReload((n) => n + 1)
            }
          />
        </View>
      );
    }

    let message: string;
    if (mode === "email") {
      if (!trimmed) message = "Nhập email để tìm bạn mới";
      else if (!emailValid)
        message = "Nhập đầy đủ địa chỉ email (ví dụ: ten@example.com)";
      else message = "Không tìm thấy người dùng phù hợp";
    } else {
      message = trimmed
        ? "Không tìm thấy bạn bè phù hợp"
        : "Bạn chưa có bạn bè nào";
    }

    return (
      <View className="items-center px-8 py-12">
        <Text className="font-open-sans text-center text-mute-foreground">
          {message}
        </Text>
      </View>
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
        data={displayed}
        extraData={busyId}
        keyExtractor={(item) => String(item.id)}
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
                : "Tìm người dùng bằng địa chỉ email chính xác"}
            </Text>
          </View>
        }
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}
