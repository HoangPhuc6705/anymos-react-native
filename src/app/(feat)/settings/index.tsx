import { HamburgerMenuIcon } from "@solar-icons/react-native/linear/hamburger-menu";
import { UserIcon } from "@solar-icons/react-native/linear/user";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Navhost, type NavTabKey } from "@/components/navhost";
import AppButton from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTabKey>("menu");

  const handleNavChange = useCallback((tab: NavTabKey) => {
    setActiveTab(tab);
    if (tab === "chat") {
      router.push("/(feat)/friend-chat" as any);
    } else if (tab === "groups") {
      router.push("/(feat)/friends" as any);
    } else if (tab === "inbox") {
      router.push("/(feat)/notification" as any);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  }, [isSigningOut, signOut]);

  const handleSignOutAllDevices = useCallback(() => {
    Alert.alert(
      "Đăng xuất khỏi tất cả thiết bị",
      "Backend hiện chưa cung cấp API thu hồi tất cả phiên đăng nhập. Nút này chưa thực hiện thao tác nào.",
    );
  }, []);

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <StatusBar style="dark" />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-6 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <Text className="font-open-sans-bold text-2xl text-[#18181B]">
          Cài đặt
        </Text>

        <View className="mt-6 flex-row items-center rounded-2xl bg-[#F7F5FF] px-4 py-4">
          <View className="h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[#E9DDFF]">
            {user?.avatarUrl ? (
              <Image
                source={{ uri: user.avatarUrl }}
                style={{ width: 56, height: 56 }}
                contentFit="cover"
              />
            ) : (
              <UserIcon size={28} color="#8E51FF" />
            )}
          </View>
          <View className="ml-3 flex-1">
            <Text className="font-open-sans-semibold text-lg text-[#18181B]">
              {user?.username ?? "Người dùng"}
            </Text>
            <Text className="mt-1 font-open-sans text-sm text-[#71717A]">
              {user?.email ?? ""}
            </Text>
          </View>
        </View>

        <View className="mt-6 rounded-2xl border border-[#E4E4E7] bg-white">
          <View className="flex-row items-center px-4 py-4">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-[#F3EEFF]">
              <HamburgerMenuIcon size={22} color="#8E51FF" />
            </View>
            <Text className="ml-3 font-open-sans-semibold text-base text-[#18181B]">
              Cài đặt
            </Text>
          </View>
        </View>

        <View className="mt-8 gap-3">
          <AppButton
            variant="destructive"
            size="large"
            loading={isSigningOut}
            onPress={handleSignOut}
            className="w-full"
          >
            Đăng xuất
          </AppButton>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Đăng xuất khỏi tất cả thiết bị"
            onPress={handleSignOutAllDevices}
            className="h-14 w-full items-center justify-center rounded-full border border-[#EF4444] active:bg-red-50"
          >
            <Text className="font-open-sans-semibold text-base text-[#DC2626]">
              Đăng xuất khỏi tất cả thiết bị
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={{ paddingBottom: insets.bottom }} className="bg-white">
        <Navhost activeTab={activeTab} onTabChange={handleNavChange} />
      </View>
    </View>
  );
}
