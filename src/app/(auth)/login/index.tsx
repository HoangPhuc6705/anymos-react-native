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
  Button,
  Checkbox,
  EyeClosedIcon,
  EyeIcon,
  GoogleIcon,
  InputGroup,
  LockIcon,
  UserIcon,
} from '@/components/ui';
import { Palette } from '@/constants/themes';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Đăng nhập thành công!');
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerClassName="flex-grow px-6 pt-12 pb-8 justify-between"
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Section: Logo & Header */}
        <View className="items-center mb-7">
          <View className="mb-5 items-center justify-center">
            <AnymosLogo />
          </View>
          <Text className="font-sans-bold text-2xl text-grey-900 mb-2 text-center">
            Login account
          </Text>
          <Text className="font-sans text-base text-grey-600 text-center leading-6">
            Welcome back! Please sign in to continue.
          </Text>
        </View>

        {/* Middle Section: Form Fields */}
        <View className="gap-4 mb-8">
          <InputGroup
            label="Username"
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            leadingIcon={<UserIcon size={20} />}
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
          />

          {/* Row: Remember Me & Forgot Password */}
          <View className="flex-row items-center justify-between mt-1">
            <Checkbox
              checked={rememberMe}
              onChange={setRememberMe}
              label="Remember me"
            />
            <Pressable
              onPress={() => router.push('/forgot-password')}
              hitSlop={8}
            >
              <Text className="font-sans-semibold text-sm text-violet-600">
                Forgot password?
              </Text>
            </Pressable>
          </View>

          {/* Action Buttons */}
          <View className="gap-3 mt-3">
            <Button
              variant="default"
              size="lg"
              fullWidth
              loading={isLoading}
              onPress={handleLogin}
            >
              Login
            </Button>

            <Button
              variant="outline"
              size="lg"
              fullWidth
              leadingIcon={<GoogleIcon size={20} />}
              onPress={() => alert('Đăng nhập bằng Google')}
            >
              Continue with Google
            </Button>
          </View>
        </View>

        {/* Footer: Register Redirect */}
        <View className="flex-row items-center justify-center gap-1 mt-4">
          <Text className="font-sans text-base text-grey-900">
            Don’t have an account?{' '}
          </Text>
          <Pressable onPress={() => router.push('/register')} hitSlop={8}>
            <Text className="font-sans-semibold text-base text-violet-600">
              Register
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
