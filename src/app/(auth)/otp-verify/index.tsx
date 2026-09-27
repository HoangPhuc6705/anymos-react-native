// src/app/(auth)/otp-verify/index.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeftIcon, Button, ShieldCheckIcon } from '@/components/ui';
import { Palette } from '@/constants/themes';

// Số ô nhập mã OTP
const OTP_LENGTH = 6;
// Thời gian đếm ngược trước khi được gửi lại mã (giây)
const RESEND_SECONDS = 59;

export default function OtpVerifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = params.email || '';

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS);
  const [otpError, setOtpError] = useState('');
  const [formError, setFormError] = useState(''); // lỗi trả về từ API (vd: mã sai/hết hạn)
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>(Array(OTP_LENGTH).fill(null));

  // Đếm ngược cho phép gửi lại mã
  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleOtpChange = (text: string, index: number) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    if (otpError) setOtpError('');

    if (cleanText.length > 1) {
      // Xử lý dán mã (paste) nhiều số cùng lúc, đủ 6 ký tự
      const digits = cleanText.slice(0, OTP_LENGTH - index).split('');
      setOtp((prev) => {
        const next = [...prev];
        digits.forEach((d, i) => {
          next[index + i] = d;
        });
        return next;
      });
      const nextFocusIndex = Math.min(index + digits.length, OTP_LENGTH - 1);
      inputRefs.current[nextFocusIndex]?.focus();
      return;
    }

    setOtp((prev) => {
      const next = [...prev];
      next[index] = cleanText;
      return next;
    });

    // Tự động chuyển sang ô tiếp theo
    if (cleanText && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    // Nhấn backspace khi ô trống thì lùi lại ô trước
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setFormError('');
    const code = otp.join('');

    if (code.length < OTP_LENGTH) {
      setOtpError(`Vui lòng nhập đủ ${OTP_LENGTH} chữ số mã xác thực.`);
      return;
    }
    setOtpError('');

    setIsVerifying(true);
    try {
      // TODO: Gọi API xác thực OTP thật tại đây, ví dụ:
      // await authApi.verifyOtp({ email, code });
      // - BE kiểm tra mã OTP theo `email` (đúng/sai, còn hạn hay không)
      // - Nếu đây là luồng Register -> điều hướng vào app hoặc yêu cầu đăng nhập lại
      // - Nếu đây là luồng Forgot Password -> điều hướng sang màn đặt lại mật khẩu
      await new Promise((resolve) => setTimeout(resolve, 1000)); // giả lập gọi API

      router.replace('/login');
    } catch (err: any) {
      // TODO: map lỗi thật từ backend, vd:
      // - 400 -> "Mã xác thực không đúng"
      // - 410 -> "Mã xác thực đã hết hạn"
      setFormError(err?.message || 'Xác thực thất bại. Vui lòng thử lại.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || isResending) return;

    setFormError('');
    setIsResending(true);
    try {
      // TODO: Gọi API gửi lại mã OTP thật tại đây, ví dụ:
      // await authApi.resendOtp({ email });
      await new Promise((resolve) => setTimeout(resolve, 800)); // giả lập gọi API

      setOtp(Array(OTP_LENGTH).fill(''));
      setResendTimer(RESEND_SECONDS);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setFormError(err?.message || 'Gửi lại mã thất bại. Vui lòng thử lại.');
    } finally {
      setIsResending(false);
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

        {/* Center Content */}
        <View className="items-center justify-center py-4">
          {/* Shield Verified Icon 56x56 */}
          <View className="w-20 h-20 rounded-pill bg-violet-50 items-center justify-center mb-6">
            <ShieldCheckIcon size={56} color={Palette.violet[500]} />
          </View>

          {/* Heading */}
          <Text className="font-sans-bold text-2xl text-grey-900 mb-2 text-center">
            Xác thực email
          </Text>
          <Text className="font-sans text-base text-grey-600 text-center leading-6 mb-6">
            {email ? (
              <>
                Nhập mã gồm {OTP_LENGTH} chữ số đã được gửi tới{'\n'}
                <Text className="text-grey-900 font-sans-semibold">{email}</Text>
              </>
            ) : (
              `Nhập mã gồm ${OTP_LENGTH} chữ số đã được gửi tới email của bạn`
            )}
          </Text>

          {/* API error banner - hiển thị lỗi trả về từ backend */}
          {formError ? (
            <View className="w-full bg-red-50 border border-error rounded-2xl px-4 py-3 mb-5">
              <Text className="font-sans text-sm text-error text-center">
                {formError}
              </Text>
            </View>
          ) : null}

          {/* 6-digit OTP Inputs */}
          <View className="w-full gap-2">
            <View className="flex-row items-center justify-center gap-2">
              {otp.map((digit, idx) => {
                const isFilled = Boolean(digit);
                const hasError = Boolean(otpError);
                return (
                  <View
                    key={idx}
                    className={`flex-1 h-14 aspect-auto rounded-2xl border-2 items-center justify-center ${
                      hasError
                        ? 'border-error bg-red-50'
                        : isFilled
                          ? 'border-violet-500 bg-white'
                          : 'border-violet-200 bg-violet-50'
                    }`}
                  >
                    <TextInput
                      ref={(ref) => {
                        inputRefs.current[idx] = ref;
                      }}
                      value={digit}
                      onChangeText={(text) => handleOtpChange(text, idx)}
                      onKeyPress={(e) => handleKeyPress(e, idx)}
                      keyboardType="number-pad"
                      maxLength={OTP_LENGTH}
                      selectTextOnFocus
                      className="font-sans-bold text-lg text-grey-950 text-center w-full h-full py-0"
                      underlineColorAndroid="transparent"
                      style={
                        Platform.OS === 'web'
                          ? ({ outlineStyle: 'none', outlineWidth: 0 } as any)
                          : undefined
                      }
                    />
                  </View>
                );
              })}
            </View>
            {otpError ? (
              <Text className="font-sans text-xs text-error text-center mt-1">
                {otpError}
              </Text>
            ) : null}
          </View>

          {/* Verify Button */}
          <Button
            variant="default"
            size="lg"
            loading={isVerifying}
            onPress={handleVerify}
            className="w-full mb-6 mt-8"
          >
            Xác thực
          </Button>

          {/* Resend Code Footer */}
          <View className="flex-row items-center justify-center gap-1">
            <Text className="font-sans text-xs text-grey-600">
              Chưa nhận được mã?{' '}
            </Text>
            <Pressable
              onPress={handleResend}
              disabled={resendTimer > 0 || isResending}
              hitSlop={8}
            >
              <Text
                className={`font-sans-semibold text-xs ${
                  resendTimer > 0 || isResending
                    ? 'text-grey-400'
                    : 'text-violet-600'
                }`}
              >
                {isResending
                  ? 'Đang gửi lại...'
                  : resendTimer > 0
                    ? `Gửi lại mã (${resendTimer}s)`
                    : 'Gửi lại mã'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}