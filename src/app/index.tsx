import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Button, InputGroup } from "@/components/ui";
import { UserIcon } from "@/components/ui/icons";

export default function Index() {
  const router = useRouter();

  return (
    <ScrollView contentContainerClassName="p-4 pt-14 pb-10 bg-grey-50 gap-3">
      <Text className="font-sans-bold text-2xl text-grey-950 mb-1">Anymos App</Text>
      <Text className="font-sans text-sm text-grey-500 mb-3">Điều hướng tự động Expo Router</Text>

      {/* Navigation to Auth Screens */}
      <View className="bg-white p-4 rounded-2xl border border-grey-200">
        <Text className="font-sans-bold text-lg text-grey-900 mb-1.5">
          Màn hình Authentication (Figma)
        </Text>
        <Text className="font-sans text-xs text-grey-500 mb-4">
          Bấm vào để mở các frame tương ứng:
        </Text>

        <View className="gap-3">
          <Button
            size="lg"
            fullWidth
            variant="default"
            onPress={() => router.push("/login")}
          >
            1. Đăng nhập (Login)
          </Button>

          <Button
            size="lg"
            fullWidth
            variant="secondary"
            onPress={() => router.push("/register")}
          >
            2. Đăng ký (Register)
          </Button>

          <Button
            size="lg"
            fullWidth
            variant="outline"
            onPress={() => router.push("/forgot-password")}
          >
            3. Quên mật khẩu (Forgot Password)
          </Button>

          <Button
            size="lg"
            fullWidth
            variant="ghost"
            onPress={() =>
              router.push({
                pathname: "/verify-otp",
                params: { email: "user@anymos.app" },
              })
            }
          >
            4. Nhập mã OTP (Verify 4-Digits)
          </Button>
        </View>
      </View>

      {/* Quick Component Preview */}
      <View className="bg-white p-4 rounded-2xl border border-grey-200">
        <Text className="font-sans-bold text-lg text-grey-900 mb-3">Preview Component</Text>
        <InputGroup
          size="lg"
          label="Username"
          placeholder="Nhập tài khoản"
          leadingIcon={<UserIcon />}
        />
        <View className="h-3" />
        <Button title="Button" size="lg" fullWidth />
      </View>
    </ScrollView>
  );
}
