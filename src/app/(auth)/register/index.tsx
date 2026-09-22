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

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = () => {
    if (!agreeTerms) {
      alert('Vui lòng đồng ý với Điều khoản và Chính sách bảo mật!');
      return;
    }
    if (password !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Chuyển sang màn hình xác thực OTP kèm email
      router.push({
        pathname: '/otp-verify',
        params: { email: email || 'example@email.com' },
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
            Join us today!
          </Text>
          <Text className="font-sans text-base text-grey-600 text-center leading-6">
            Create your account in just a few steps.
          </Text>
        </View>

        {/* Form Fields */}
        <View className="gap-4 mb-7">
          <InputGroup
            label="Username"
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            leadingIcon={<UserIcon size={20} />}
          />

          <InputGroup
            label="Email"
            placeholder="example@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leadingIcon={<MailIcon size={20} />}
          />

          <InputGroup
            label="Password"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            leadingIcon={<LockIcon size={20} />}
            trailingIcon={
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={8}
              >
                {showPassword ? (
                  <EyeIcon size={20} color={Palette.violet[500]} />
                ) : (
                  <EyeClosedIcon size={20} />
                )}
              </Pressable>
            }
          />

          <InputGroup
            label="Confirm password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            leadingIcon={<LockIcon size={20} />}
            trailingIcon={
              <Pressable
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                hitSlop={8}
              >
                {showConfirmPassword ? (
                  <EyeIcon size={20} color={Palette.violet[500]} />
                ) : (
                  <EyeClosedIcon size={20} />
                )}
              </Pressable>
            }
          />

          {/* Terms Checkbox */}
          <View className="mt-1">
            <Checkbox
              checked={agreeTerms}
              onChange={setAgreeTerms}
              label="I accept the Terms & Privacy Policy."
            />
          </View>

          {/* Action Buttons */}
          <View className="gap-3 mt-3">
            <Button
              variant="default"
              size="lg"
              fullWidth
              loading={isLoading}
              onPress={handleRegister}
            >
              Create account
            </Button>

            <Button
              variant="outline"
              size="lg"
              fullWidth
              leadingIcon={<GoogleIcon size={20} />}
              onPress={() => alert('Đăng ký bằng Google')}
            >
              Continue with Google
            </Button>
          </View>
        </View>

        {/* Footer: Login Redirect */}
        <View className="flex-row items-center justify-center gap-1 mt-4">
          <Text className="font-sans text-base text-grey-900">
            Already have an account?{' '}
          </Text>
          <Pressable onPress={() => router.push('/login')} hitSlop={8}>
            <Text className="font-sans-semibold text-base text-violet-600">
              Login
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
