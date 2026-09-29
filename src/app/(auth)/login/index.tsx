// src/app/(auth)/login/index.tsx
import {
  AnymosLogo,
  Button,
  Checkbox,
  EyeClosedIcon,
  EyeIcon,
  GoogleIcon,
  InputGroup,
  LockIcon,
  UserIcon,
} from "@/components/ui";
import { Palette } from "@/constants/themes";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  ToastAndroid,
  View,
} from "react-native";

// Regex kiểm tra định dạng email cơ bản
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LoginFormErrors {
  identifier?: string;
  password?: string;
}

export default function LoginScreen() {
  const router = useRouter();

  // --- Form state ---
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // --- UI state ---
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- Xử lý nút Back cứng Android khi Login là màn gốc (không còn màn nào để GO_BACK) ---
  const backPressedOnceRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== "android") return;

      const onHardwareBackPress = () => {
        // Nếu stack vẫn còn màn phía sau (vd: từ Register/Forgot bấm back về Login
        // rồi bấm back tiếp) thì để hệ thống tự xử lý bình thường
        if (router.canGoBack()) {
          return false;
        }

        // Đang ở màn gốc -> không còn gì để GO_BACK -> tự xử lý thay vì để unhandled
        if (backPressedOnceRef.current) {
          BackHandler.exitApp();
          return true;
        }

        backPressedOnceRef.current = true;
        ToastAndroid.show(
          "Nhấn Back lần nữa để thoát ứng dụng",
          ToastAndroid.SHORT,
        );
        setTimeout(() => {
          backPressedOnceRef.current = false;
        }, 2000);

        return true; // đã tự xử lý -> chặn warning GO_BACK unhandled
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onHardwareBackPress,
      );
      return () => subscription.remove();
    }, [router]),
  );

  const validate = (): boolean => {
    const nextErrors: LoginFormErrors = {};
    const trimmedIdentifier = identifier.trim();

    if (!trimmedIdentifier) {
      nextErrors.identifier = "Vui lòng nhập tên đăng nhập hoặc email.";
    } else if (trimmedIdentifier.includes("@")) {
      if (!EMAIL_REGEX.test(trimmedIdentifier)) {
        nextErrors.identifier = "Email không đúng định dạng.";
      }
    } else if (trimmedIdentifier.length < 3) {
      nextErrors.identifier = "Tên đăng nhập phải có ít nhất 3 ký tự.";
    }

    if (!password) {
      nextErrors.password = "Vui lòng nhập mật khẩu.";
    } else if (password.length < 6) {
      nextErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = async () => {
    setFormError("");
    if (!validate()) return;

    setIsLoading(true);
    try {
      // TODO: Gọi API đăng nhập thật tại đây
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.replace("/(feat)/friend-chat" as any);
    } catch (err: any) {
      setFormError(err?.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Tích hợp Google OAuth
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerClassName="flex-grow px-6 pt-12 pb-8"
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center mb-7">
          <View className="mb-5 items-center justify-center">
            <AnymosLogo />
          </View>
          <Text className="font-sans-bold text-2xl text-grey-900 mb-2 text-center">
            Đăng nhập
          </Text>
          <Text className="font-sans text-base text-grey-600 text-center leading-6">
            Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.
          </Text>
        </View>

        {formError ? (
          <View className="bg-red-50 border border-error rounded-2xl px-4 py-3 mb-4">
            <Text className="font-sans text-sm text-error text-center">
              {formError}
            </Text>
          </View>
        ) : null}

        <View className="gap-4 mb-8">
          <InputGroup
            size="large"
            label="Tên đăng nhập hoặc Email"
            placeholder="Tên đăng nhập hoặc email"
            value={identifier}
            onChangeText={(text) => {
              setIdentifier(text);
              if (errors.identifier) {
                setErrors((prev) => ({ ...prev, identifier: undefined }));
              }
            }}
            autoCapitalize="none"
            autoCorrect={false}
            leadingIcon={<UserIcon size={20} />}
            error={errors.identifier}
          />

          <InputGroup
            size="large"
            label="Mật khẩu"
            placeholder="Mật khẩu"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            leadingIcon={<LockIcon size={20} />}
            trailingIcon={
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                }
              >
                {showPassword ? (
                  <EyeIcon size={20} color={Palette.violet[500]} />
                ) : (
                  <EyeClosedIcon size={20} />
                )}
              </Pressable>
            }
            error={errors.password}
          />

          <View className="flex-row items-center justify-between mt-1 gap-3">
            <Checkbox
              checked={rememberMe}
              onChange={setRememberMe}
              label="Ghi nhớ đăng nhập"
              style={{ maxWidth: "60%", flexShrink: 1 }}
            />
            <Pressable
              onPress={() => router.push("/forgot-password")}
              hitSlop={8}
              style={{ flexShrink: 0 }}
            >
              <Text className="font-sans-semibold text-sm text-violet-600">
                Quên mật khẩu?
              </Text>
            </Pressable>
          </View>

          <View className="gap-3 mt-3">
            <Button
              variant="default"
              size="lg"
              loading={isLoading}
              onPress={handleLogin}
              className="w-full"
            >
              Đăng nhập
            </Button>

            <Button
              variant="outline"
              size="lg"
              leadingIcon={<GoogleIcon size={20} />}
              onPress={handleGoogleLogin}
              className="w-full"
            >
              Tiếp tục với Google
            </Button>
          </View>
        </View>

        {/* Footer: Register Redirect - đã đưa lên ngay dưới nhóm nút, không còn dính đáy màn hình */}
        <View className="flex-row items-center justify-center gap-1 mt-6">
          <Text className="font-sans text-base text-grey-900">
            Chưa có tài khoản?{" "}
          </Text>
          <Pressable onPress={() => router.push("/register")} hitSlop={8}>
            <Text className="font-sans-semibold text-base text-violet-600">
              Đăng ký
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
