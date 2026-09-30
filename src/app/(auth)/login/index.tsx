// src/app/(auth)/login/index.tsx
import {
  AnymosLogo,
  Button,
  EyeClosedIcon,
  EyeIcon,
  InputGroup,
  LockIcon,
  MailIcon
} from "@/components/ui";
import { Palette } from "@/constants/themes";
import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/services/api";
import * as authApi from "@/services/auth";
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
  email?: string;
  password?: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  // --- Form state ---
  const [email, setEmail] = useState("");
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
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      nextErrors.email = "Vui lòng nhập email.";
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      nextErrors.email = "Email không đúng định dạng.";
    }

    // Đăng nhập chỉ cần có mật khẩu; luật độ mạnh chỉ áp dụng lúc đăng ký
    if (!password) {
      nextErrors.password = "Vui lòng nhập mật khẩu.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = async () => {
    setFormError("");
    if (!validate()) return;

    const t0 = Date.now();
    console.log("[login] bấm nút");

    setIsLoading(true);
    try {
      const res = await authApi.login({ email: email.trim(), password });
      console.log('[login] expiresIn =', res.expiresIn, 'refreshToken có =', !!res.refreshToken);
      console.log("[login] API xong", Date.now() - t0, "ms");

      // Lưu token. Guard trong app/_layout.tsx sẽ tự chuyển sang giao diện app.
      await signIn(res);
      console.log("[login] signIn xong", Date.now() - t0, "ms");
    } catch (err) {
      console.log("[login] lỗi", Date.now() - t0, "ms", err);
      if (err instanceof ApiError) {
        const f = err.fieldErrors ?? {};
        if (err.code === "VALIDATION_ERROR" && (f.email || f.password)) {
          setErrors({ email: f.email, password: f.password });
        } else {
          setFormError(err.message);
        }
      } else {
        setFormError("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
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
            label="Email"
            placeholder="example@gmail.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            leadingIcon={<MailIcon size={20} />}
            error={errors.email}
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
