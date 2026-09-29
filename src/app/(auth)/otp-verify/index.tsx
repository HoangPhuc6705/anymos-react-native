import { AuthScreen } from '@/components/auth/AuthScreen';
import { Button, ShieldCheckIcon } from '@/components/ui';
import { Palette } from '@/constants/themes';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    NativeSyntheticEvent,
    Platform,
    Pressable,
    Text,
    TextInput,
    TextInputKeyPressEventData,
    View,
} from 'react-native';

export default function OtpVerifyScreen() {
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

    if (cleanText && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
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
    <AuthScreen
      title="Verify your email"
      description={
        <>
          Enter the 4-digit code sent to{'\n'}
          <Text className="font-open-sans-semibold text-[#18181B]">{email}</Text>
        </>
      }
      onBack={() => router.back()}
      headerIcon={<ShieldCheckIcon size={38} color={Palette.violet[500]} />}
    >
      <View className="items-center">
        <View className="mb-8 flex-row items-center justify-center gap-4">
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

        <Button
          variant="default"
          size="lg"
          className="mb-6 w-full"
          loading={isLoading}
          onPress={handleVerify}
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
    </AuthScreen>
  );
}
