// src/app/(auth)/register/index.tsx
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  AnymosLogo,
  ArrowLeftIcon,
  Button,
  Checkbox,
  EyeClosedIcon,
  EyeIcon,
  GoogleIcon,
  InputGroup,
  LockIcon,
  MailIcon,
  UserIcon,
} from '@/components/ui';
import { Palette } from '@/constants/themes';
import { useAuth } from '@/context/auth-context';
import { ApiError } from '@/services/api';
import * as authApi from '@/services/auth';

// Regex kiểm tra định dạng email cơ bản
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Username: chỉ cho phép chữ, số, dấu chấm và gạch dưới (khớp cột `user.username` VARCHAR(50))
const USERNAME_REGEX = /^[a-zA-Z0-9._]+$/;

interface RegisterFormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeTerms?: string;
}

export default function RegisterScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  // --- Form state (khớp bảng `user`: username, email, password_hash) ---
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // --- UI state ---
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [formError, setFormError] = useState(''); // lỗi trả về từ API (vd: username/email đã tồn tại)
  const [isLoading, setIsLoading] = useState(false);

  const clearFieldError = (field: keyof RegisterFormErrors) => {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const validate = (): boolean => {
    const nextErrors: RegisterFormErrors = {};

    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      nextErrors.username = 'Vui lòng nhập tên đăng nhập.';
    } else if (trimmedUsername.length < 3 || trimmedUsername.length > 50) {
      nextErrors.username = 'Tên đăng nhập phải từ 3 đến 50 ký tự.';
    } else if (!USERNAME_REGEX.test(trimmedUsername)) {
      nextErrors.username = 'Tên đăng nhập chỉ gồm chữ, số, dấu chấm và gạch dưới.';
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      nextErrors.email = 'Vui lòng nhập email.';
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      nextErrors.email = 'Email không đúng định dạng.';
    }

    if (!password) {
      nextErrors.password = 'Vui lòng nhập mật khẩu.';
    } else if (password.length < 8 || password.length > 72) {
      nextErrors.password = 'Mật khẩu phải từ 8 đến 72 ký tự.';
    } else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      nextErrors.password = 'Mật khẩu phải có cả chữ và số.';
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu.';
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    }

    if (!agreeTerms) {
      nextErrors.agreeTerms = 'Bạn cần đồng ý Điều khoản & Chính sách bảo mật.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleRegister = async () => {
    setFormError('');
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await authApi.register({
        username: username.trim(),
        email: email.trim(),
        password,
      });
      // Đăng ký xong là đăng nhập luôn: lưu token, guard trong app/_layout.tsx
      // tự chuyển sang giao diện app (không còn bước OTP sau đăng ký).
      await signIn(res);
    } catch (err) {
      if (err instanceof ApiError) {
        switch (err.code) {
          case 'EMAIL_ALREADY_EXISTS':
            setErrors((prev) => ({ ...prev, email: 'Email này đã được sử dụng.' }));
            break;
          case 'USERNAME_ALREADY_EXISTS':
            setErrors((prev) => ({ ...prev, username: 'Tên đăng nhập đã được sử dụng.' }));
            break;
          case 'PASSWORD_TOO_LONG':
            setErrors((prev) => ({
              ...prev,
              password: 'Mật khẩu quá dài, vui lòng chọn mật khẩu ngắn hơn.',
            }));
            break;
          case 'VALIDATION_ERROR': {
            const f = err.fieldErrors ?? {};
            if (f.username || f.email || f.password) {
              setErrors((prev) => ({
                ...prev,
                username: f.username ?? prev.username,
                email: f.email ?? prev.email,
                password: f.password ?? prev.password,
              }));
            } else {
              setFormError(err.message);
            }
            break;
          }
          default:
            setFormError(err.message);
        }
      } else {
        setFormError('Đăng ký thất bại. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerClassName="flex-grow px-6 pt-11 pb-8"
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Bar: Back Button */}
        <View className="flex-row items-center mb-2">
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            className="w-10 h-10 justify-center items-start"
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
          >
            <ArrowLeftIcon size={24} />
          </Pressable>
        </View>

        {/* Header: Logo & Title */}
        <View className="items-center mb-6">
          <View className="mb-4 items-center justify-center">
            <AnymosLogo />
          </View>
          <Text className="font-sans-bold text-2xl text-grey-900 mb-2 text-center">
            Tạo tài khoản mới!
          </Text>
          <Text className="font-sans text-base text-grey-600 text-center leading-6">
            Chỉ vài bước đơn giản để bắt đầu.
          </Text>
        </View>

        {/* API error banner - hiển thị lỗi trả về từ backend */}
        {formError ? (
          <View className="bg-red-50 border border-error rounded-2xl px-4 py-3 mb-4">
            <Text className="font-sans text-sm text-error text-center">
              {formError}
            </Text>
          </View>
        ) : null}

        {/* Form Fields */}
        <View className="gap-4 mb-7">
          <InputGroup
            size="large"
            label="Tên đăng nhập"
            placeholder="Tên đăng nhập"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              clearFieldError('username');
            }}
            autoCapitalize="none"
            autoCorrect={false}
            leadingIcon={<UserIcon size={20} />}
            error={errors.username}
          />

          <InputGroup
            size="large"
            label="Email"
            placeholder="example@gmail.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              clearFieldError('email');
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
              clearFieldError('password');
              // Nếu confirmPassword đã nhập trước đó và giờ khớp lại -> tự xoá lỗi confirm
              if (errors.confirmPassword && text === confirmPassword) {
                clearFieldError('confirmPassword');
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
                accessibilityLabel={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
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

          <InputGroup
            size="large"
            label="Xác nhận mật khẩu"
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              clearFieldError('confirmPassword');
            }}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            leadingIcon={<LockIcon size={20} />}
            trailingIcon={
              <Pressable
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={
                  showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'
                }
              >
                {showConfirmPassword ? (
                  <EyeIcon size={20} color={Palette.violet[500]} />
                ) : (
                  <EyeClosedIcon size={20} />
                )}
              </Pressable>
            }
            error={errors.confirmPassword}
          />

          {/* Terms Checkbox */}
          <View className="mt-1">
            <Checkbox
              checked={agreeTerms}
              onChange={(checked) => {
                setAgreeTerms(checked);
                clearFieldError('agreeTerms');
              }}
              label="Tôi đồng ý với Điều khoản & Chính sách bảo mật."
              error={errors.agreeTerms}
            />
            {errors.agreeTerms ? (
              <Text className="font-sans text-xs text-error mt-1 ml-8">
                {errors.agreeTerms}
              </Text>
            ) : null}
          </View>

          {/* Action Buttons */}
          <View className="gap-3 mt-3">
            <Button
              variant="default"
              size="lg"
              loading={isLoading}
              onPress={handleRegister}
              className="w-full"
            >
              Tạo tài khoản
            </Button>

          </View>
        </View>

        {/* Footer: Login Redirect - đã lên ngay dưới nhóm nút, không còn dính đáy màn hình */}
        <View className="flex-row items-center justify-center gap-1 mt-4">
          <Text className="font-sans text-base text-grey-900">
            Đã có tài khoản?{' '}
          </Text>
          <Pressable onPress={() => router.push('/login')} hitSlop={8}>
            <Text className="font-sans-semibold text-base text-violet-600">
              Đăng nhập
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}