import { AuthScreen } from '@/components/auth/AuthScreen';
import {
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
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

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
    <AuthScreen
      title="Create your account"
      description="A few details and you’re ready to connect."
      onBack={() => router.back()}
      footer={
        <View className="flex-row items-center justify-center gap-1">
          <Text className="font-open-sans text-sm text-[#52525C]">
            Already have an account?{' '}
          </Text>
          <Pressable onPress={() => router.push('/login')} hitSlop={8}>
            <Text className="font-open-sans-semibold text-sm text-[#6D28D9]">
              Login
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
              className="w-full"
              loading={isLoading}
              onPress={handleRegister}
            >
              Create account
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              leadingIcon={<GoogleIcon size={20} />}
              onPress={() => alert('Đăng ký bằng Google')}
            >
              Continue with Google
            </Button>
          </View>

      </View>
    </AuthScreen>
  );
}
