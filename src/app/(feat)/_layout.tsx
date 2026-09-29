// src/app/(feat)/_layout.tsx
import { Stack } from 'expo-router';

// Gom các màn hình sau đăng nhập vào một navigator riêng
// để app/_layout.tsx có thể bảo vệ cả nhóm bằng Stack.Protected.
export default function FeatLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
