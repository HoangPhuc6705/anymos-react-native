// src/app/(auth)/forgot-password/index.tsx
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
  ArrowLeftIcon,
  Button,
  InputGroup,
  KeyUnlockedIcon,
  MailIcon,
} from '@/components/ui';
import { Palette } from '@/constants/themes';

// Regex kiểm tra định dạng email cơ bản
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen() {
  const router = useRouter();

  // --- Form state (khớp cột `user.email` VARCHAR(255) UNIQUE) ---
  const [email, setEmail] = useState('');

  // --- UI state ---
  const [emailError, setEmailError] = useState('');
  const [formError, setFormError] = useState(''); // lỗi trả về từ API (vd: email không tồn tại)
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailError('Vui lòng nhập địa chỉ email.');
      return false;
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setEmailError('Email không đúng định dạng.');
      return false;
    }

    setEmailError('');
    return true;
  };

  const handleSendCode = async () => {
    setFormError('');
    if (!validate()) return;

    setIsLoading(true);
    try {
      // TODO: Gọi API gửi mã OTP thật tại đây, ví dụ:
      // await authApi.forgotPassword({ email: email.trim() });
      // - BE kiểm tra `email` có tồn tại trong bảng `user` không, sinh OTP và gửi qua email
      // - Nếu BE trả 404 (email chưa đăng ký) -> hiển thị lỗi tương ứng ở field email
      await new Promise((resolve) => setTimeout(resolve, 1000)); // giả lập gọi API

      // Gửi OTP thành công -> chuyển sang màn xác thực OTP kèm email
      router.push({
        pathname: '/otp-verify',
        params: { email: email.trim() },
      });
    } catch (err: any) {
      // TODO: map lỗi thật từ backend, vd:
      // - 404 -> "Email này chưa được đăng ký"
      setFormError(err?.message || 'Gửi mã xác thực thất bại. Vui lòng thử lại.');
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
        <View className="flex-row items-center mb-4">
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

        {/* Center Section: Icon, Title, Form */}
        <View className="items-center justify-center py-5">
          {/* Key Unlocked Icon 56x56 */}
          <View className="w-20 h-20 rounded-pill bg-violet-50 items-center justify-center mb-6">
            <KeyUnlockedIcon size={56} color={Palette.violet[500]} />
          </View>

          {/* Heading */}
          <Text className="font-sans-bold text-2xl text-grey-900 mb-2 text-center">
            Quên mật khẩu?
          </Text>
          <Text className="font-sans text-base text-grey-600 text-center leading-6 mb-8 px-2">
            Đừng lo lắng! Nhập email đã đăng ký, chúng tôi sẽ gửi mã xác thực
            để bạn đặt lại mật khẩu.
          </Text>

          {/* API error banner - hiển thị lỗi trả về từ backend */}
          {formError ? (
            <View className="w-full bg-red-50 border border-error rounded-2xl px-4 py-3 mb-5">
              <Text className="font-sans text-sm text-error text-center">
                {formError}
              </Text>
            </View>
          ) : null}

          {/* Email Input */}
          <View className="w-full gap-5">
            <InputGroup
              size="large"
              label="Email"
              placeholder="example@gmail.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              leadingIcon={<MailIcon size={20} />}
              error={emailError}
            />

            <Button
              variant="default"
              size="lg"
              loading={isLoading}
              onPress={handleSendCode}
              className="w-full mt-2"
            >
              Gửi mã xác thực
            </Button>
          </View>

          {/* Footer: Back to Login */}
          <View className="flex-row items-center justify-center gap-1 mt-6">
            <Text className="font-sans text-base text-grey-900">
              Đã nhớ mật khẩu?{' '}
            </Text>
            <Pressable onPress={() => router.push('/login')} hitSlop={8}>
              <Text className="font-sans-semibold text-base text-violet-600">
                Đăng nhập
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}