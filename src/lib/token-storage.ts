// src/lib/token-storage.ts
// Lưu token trong kho bảo mật của hệ điều hành (Keychain / Keystore), không dùng AsyncStorage.
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import type { AuthResponse, AuthUser } from '@/services/types';

const KEYS = {
  accessToken: 'auth.accessToken',
  accessExpiresAt: 'auth.accessExpiresAt',
  refreshToken: 'auth.refreshToken',
  user: 'auth.user',
  deviceId: 'auth.deviceId',
} as const;

export interface StoredSession {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  /** Thời điểm access token hết hạn (mili-giây, theo đồng hồ máy) */
  accessExpiresAt: number;
}

/**
 * Lưu phiên đăng nhập. Trả về thời điểm access token hết hạn.
 * Tính từ lúc nhận phản hồi + expiresIn (giây) chứ không đọc claim `exp` trong JWT,
 * để không phụ thuộc đồng hồ máy có khớp đồng hồ server hay không.
 */
export async function saveSession(res: AuthResponse): Promise<number> {
  const accessExpiresAt = Date.now() + res.expiresIn * 1000;
  await Promise.all([
    SecureStore.setItemAsync(KEYS.accessToken, res.accessToken),
    SecureStore.setItemAsync(KEYS.accessExpiresAt, String(accessExpiresAt)),
    SecureStore.setItemAsync(KEYS.refreshToken, res.refreshToken),
    SecureStore.setItemAsync(KEYS.user, JSON.stringify(res.user)),
  ]);
  return accessExpiresAt;
}

export async function loadSession(): Promise<StoredSession | null> {
  try {
    const [accessToken, expiresAtRaw, refreshToken, userJson] = await Promise.all([
      SecureStore.getItemAsync(KEYS.accessToken),
      SecureStore.getItemAsync(KEYS.accessExpiresAt),
      SecureStore.getItemAsync(KEYS.refreshToken),
      SecureStore.getItemAsync(KEYS.user),
    ]);
    if (!accessToken || !refreshToken || !userJson) return null;
    return {
      accessToken,
      refreshToken,
      user: JSON.parse(userJson) as AuthUser,
      // Thiếu giá trị (bản cũ chưa lưu) thì coi như đã hết hạn để làm mới ngay
      accessExpiresAt: Number(expiresAtRaw) || 0,
    };
  } catch {
    // Dữ liệu hỏng hoặc kho bảo mật lỗi: coi như chưa đăng nhập
    return null;
  }
}

/** Xóa phiên đăng nhập. deviceId được giữ lại vì nó gắn với thiết bị, không gắn với tài khoản. */
export async function clearSession(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(KEYS.accessToken),
    SecureStore.deleteItemAsync(KEYS.accessExpiresAt),
    SecureStore.deleteItemAsync(KEYS.refreshToken),
    SecureStore.deleteItemAsync(KEYS.user),
  ]);
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.refreshToken);
}

export async function getAccessSnapshot(): Promise<{ token: string | null; expiresAt: number }> {
  const [token, expiresAtRaw] = await Promise.all([
    SecureStore.getItemAsync(KEYS.accessToken),
    SecureStore.getItemAsync(KEYS.accessExpiresAt),
  ]);
  return { token, expiresAt: Number(expiresAtRaw) || 0 };
}

/** ID của thiết bị: sinh một lần ở lần chạy đầu rồi dùng lại mãi. */
export async function getDeviceId(): Promise<string> {
  const existing = await SecureStore.getItemAsync(KEYS.deviceId);
  if (existing) return existing;
  const id = Crypto.randomUUID();
  await SecureStore.setItemAsync(KEYS.deviceId, id);
  return id;
}