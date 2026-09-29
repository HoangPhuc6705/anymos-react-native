import { AuthScreen } from '@/components/auth/AuthScreen';
import {
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
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

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
    <AuthScreen
      title="Welcome back"
      description="Sign in to pick up where you left off."
      footer={
        <View className="flex-row items-center justify-center gap-1">
          <Text className="font-open-sans text-sm text-[#52525C]">
            Don’t have an account?{' '}
          </Text>
          <Pressable onPress={() => router.push('/register')} hitSlop={8}>
            <Text className="font-open-sans-semibold text-sm text-[#6D28D9]">
              Register
            </Text>
          </Pressable>
        </View>
      }
    >
      <View className="gap-4">
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
          <View className="mt-1 flex-row items-center justify-between">
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
          <View className="mt-3 gap-3">
            <Button
              variant="default"
              size="lg"
              className="w-full"
              loading={isLoading}
              onPress={handleLogin}
            >
              Login
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              leadingIcon={<GoogleIcon size={20} />}
              onPress={() => alert('Đăng nhập bằng Google')}
            >
              Continue with Google
            </Button>
          </View>

      </View>
    </AuthScreen>
  );
}
