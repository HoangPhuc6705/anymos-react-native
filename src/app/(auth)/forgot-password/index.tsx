import { AuthScreen } from '@/components/auth/AuthScreen';
import {
    Button,
    InputGroup,
    KeyUnlockedIcon,
    MailIcon
} from '@/components/ui';
import { Palette } from '@/constants/themes';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = () => {
    if (!email) {
      alert('Vui lòng nhập địa chỉ email!');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Chuyển sang màn hình xác thực OTP và truyền email
      router.push({
        pathname: '/otp-verify',
        params: { email },
      });
    }, 1000);
  };

  return (
    <AuthScreen
      title="Reset your password"
      description="Enter your email and we’ll send a verification code to get you back in."
      onBack={() => router.back()}
      headerIcon={<KeyUnlockedIcon size={38} color={Palette.violet[500]} />}
    >
      <View className="w-full gap-5">
            <InputGroup
              label="Email"
              placeholder="example@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leadingIcon={<MailIcon size={20} />}
            />

            <Button
              variant="default"
              size="lg"
              className="mt-2 w-full"
              loading={isLoading}
              onPress={handleSendCode}
            >
              Send Verification Code
            </Button>
      </View>
    </AuthScreen>
  );
}
