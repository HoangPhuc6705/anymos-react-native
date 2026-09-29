// src/lib/config.ts
import Constants from 'expo-constants';

const API_PORT = 8080;

/**
 * Địa chỉ backend Spring Boot.
 *
 * Thứ tự ưu tiên:
 * 1. EXPO_PUBLIC_API_URL trong file .env (ví dụ http://192.168.1.10:8080)
 * 2. Chạy Expo Go: lấy IP của máy đang chạy `expo start` từ hostUri
 *    (điện thoại và máy tính phải cùng Wi-Fi). Backend chạy cùng máy đó nên dùng chung IP.
 * 3. Dự phòng: localhost (chỉ đúng với web/simulator iOS)
 *
 * Lưu ý: `expo start --tunnel` cho hostUri là tên miền của Expo, không phải IP máy bạn,
 * nên khi dùng tunnel bắt buộc phải đặt EXPO_PUBLIC_API_URL.
 */
function resolveBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, '');

  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  if (host) return `http://${host}:${API_PORT}`;

  return `http://localhost:${API_PORT}`;
}

export const API_BASE_URL = resolveBaseUrl();
