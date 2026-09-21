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
import {
  ArrowLeftIcon,
  Button,
  ShieldCheckIcon,
} from '@/components/ui';
import { Palette } from '@/constants/themes';

export default function VerifyOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = params.email || 'hydransea17216@email.com';

  const [otp, setOtp] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(59);
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  // Resend countdown timer
  useEffect(() => {
    let timer: any;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleOtpChange = (text: string, index: number) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    const newOtp = [...otp];

    if (cleanText.length > 1) {
      // Xử lý dán mã (paste) nhiều số
      const digits = cleanText.slice(0, 4).split('');
      digits.forEach((d, i) => {
        newOtp[i] = d;
      });
      setOtp(newOtp);
      inputRefs[Math.min(digits.length, 3)].current?.focus();
      return;
    }

    newOtp[index] = cleanText;
    setOtp(newOtp);

    // Tự động chuyển sang ô tiếp theo
    if (cleanText && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    // Nhấn backspace khi ô trống thì lùi lại ô trước
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < 4) {
      alert('Vui lòng nhập đủ 4 chữ số mã xác thực!');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`Xác thực thành công với mã: ${code}`);
      router.replace('/');
    }, 1000);
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(59);
    alert(`Đã gửi lại mã xác thực tới ${email}`);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerClassName="flex-grow px-6 pt-11 pb-8 justify-between"
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
            Verify your email
          </Text>
          <Text className="font-sans text-base text-grey-600 text-center leading-6 mb-8">
            Please enter the 4-digit code sent to{'\n'}
            <Text className="text-grey-900 font-sans-semibold">{email}</Text>
          </Text>

          {/* 4-digit OTP Inputs (Figma: State=otp, borderRadius: 100px) */}
          <View className="flex-row items-center justify-center gap-4 mb-8">
            {otp.map((digit, idx) => {
              const isFilled = Boolean(digit);
              return (
                <View
                  key={idx}
                  className={`w-[60px] h-[60px] rounded-pill border-2 items-center justify-center ${
                    isFilled
                      ? 'border-violet-500 bg-white'
                      : 'border-violet-200 bg-violet-50'
                  }`}
                >
                  <TextInput
                    ref={inputRefs[idx]}
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, idx)}
                    onKeyPress={(e) => handleKeyPress(e, idx)}
                    keyboardType="number-pad"
                    maxLength={1}
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

          {/* Verify Button */}
          <Button
            variant="default"
            size="lg"
            fullWidth
            loading={isLoading}
            onPress={handleVerify}
            className="w-full mb-6"
          >
            Verify
          </Button>

          {/* Resend Code Footer */}
          <View className="flex-row items-center justify-center gap-1">
            <Text className="font-sans text-xs text-grey-600">
              Didn't receive the code?{' '}
            </Text>
            <Pressable onPress={handleResend} disabled={resendTimer > 0}>
              <Text
                className={`font-sans-semibold text-xs ${
                  resendTimer > 0 ? 'text-grey-400' : 'text-violet-600'
                }`}
              >
                {resendTimer > 0
                  ? `Resend code (${resendTimer}s)`
                  : 'Resend code'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Bottom spacer */}
        <View className="h-8" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
