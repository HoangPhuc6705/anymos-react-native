// src/app/index.tsx
import { Redirect } from 'expo-router';
import { useAuth } from '@/context/auth-context';

export default function Index() {
  const { isAuthenticated } = useAuth();

  // Đã đăng nhập (token còn trong SecureStore) thì vào app, chưa thì vào Login.
  // Trạng thái isLoading đã được app/_layout.tsx xử lý (giữ splash) trước khi màn này hiện.
  return (
    <Redirect
      href={(isAuthenticated ? '/(feat)/friend-chat' : '/(auth)/login') as any}
    />
  );
}
