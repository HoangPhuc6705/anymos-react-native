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

        {/* Center Section: Icon, Title, Form */}
        <View className="items-center justify-center py-5">
          {/* Key Unlocked Icon 56x56 */}
          <View className="w-20 h-20 rounded-pill bg-violet-50 items-center justify-center mb-6">
            <KeyUnlockedIcon size={56} color={Palette.violet[500]} />
          </View>

          {/* Heading */}
          <Text className="font-sans-bold text-2xl text-grey-900 mb-2 text-center">
            Forgot password?
          </Text>
          <Text className="font-sans text-base text-grey-600 text-center leading-6 mb-8 px-2">
            Don’t worry! Enter your registered email address and we’ll send you
            instructions to reset it.
          </Text>

          {/* Email Input */}
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
              fullWidth
              loading={isLoading}
              onPress={handleSendCode}
              className="mt-2"
            >
              Send Verification Code
            </Button>
          </View>
        </View>

        {/* Bottom space filler */}
        <View className="h-10" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
