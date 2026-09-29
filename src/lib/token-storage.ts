// src/lib/token-storage.ts
// Lưu token trong kho bảo mật của hệ điều hành (Keychain / Keystore), không dùng AsyncStorage.
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import type { AuthResponse, AuthUser } from '@/services/types';

const KEYS = {
  accessToken: 'auth.accessToken',
  refreshToken: 'auth.refreshToken',
  user: 'auth.user',
  deviceId: 'auth.deviceId',
} as const;

export interface StoredSession {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export async function saveSession(res: AuthResponse): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(KEYS.accessToken, res.accessToken),
    SecureStore.setItemAsync(KEYS.refreshToken, res.refreshToken),
    SecureStore.setItemAsync(KEYS.user, JSON.stringify(res.user)),
  ]);
}

export async function loadSession(): Promise<StoredSession | null> {
  try {
    const [accessToken, refreshToken, userJson] = await Promise.all([
      SecureStore.getItemAsync(KEYS.accessToken),
      SecureStore.getItemAsync(KEYS.refreshToken),
      SecureStore.getItemAsync(KEYS.user),
    ]);
    if (!accessToken || !refreshToken || !userJson) return null;
    return { accessToken, refreshToken, user: JSON.parse(userJson) as AuthUser };
  } catch {
    // Dữ liệu hỏng hoặc kho bảo mật lỗi: coi như chưa đăng nhập
    return null;
  }
}

/** Xóa phiên đăng nhập. deviceId được giữ lại vì nó gắn với thiết bị, không gắn với tài khoản. */
export async function clearSession(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(KEYS.accessToken),
    SecureStore.deleteItemAsync(KEYS.refreshToken),
    SecureStore.deleteItemAsync(KEYS.user),
  ]);
}

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.accessToken);
}

/** ID của thiết bị: sinh một lần ở lần chạy đầu rồi dùng lại mãi. */
export async function getDeviceId(): Promise<string> {
  const existing = await SecureStore.getItemAsync(KEYS.deviceId);
  if (existing) return existing;
  const id = Crypto.randomUUID();
  await SecureStore.setItemAsync(KEYS.deviceId, id);
  return id;
}
