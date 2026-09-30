// src/lib/token-storage.ts
// Lưu token trong kho bảo mật của hệ điều hành (Keychain / Keystore), không dùng AsyncStorage.
// Hỗ trợ Web (dùng localStorage)
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
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

// Hàm trợ giúp để hỗ trợ web
async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn('localStorage is not available', e);
    }
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.warn('localStorage is not available', e);
    }
    return null;
  }
  return await SecureStore.getItemAsync(key);
}

async function deleteItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn('localStorage is not available', e);
    }
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

/**
 * Lưu phiên đăng nhập. Trả về thời điểm access token hết hạn.
 * Tính từ lúc nhận phản hồi + expiresIn (giây) chứ không đọc claim `exp` trong JWT,
 * để không phụ thuộc đồng hồ máy có khớp đồng hồ server hay không.
 */
export async function saveSession(res: AuthResponse): Promise<number> {
  const accessExpiresAt = Date.now() + res.expiresIn * 1000;
  await Promise.all([
    setItem(KEYS.accessToken, res.accessToken),
    setItem(KEYS.accessExpiresAt, String(accessExpiresAt)),
    setItem(KEYS.refreshToken, res.refreshToken),
    setItem(KEYS.user, JSON.stringify(res.user)),
  ]);
  return accessExpiresAt;
}

export async function loadSession(): Promise<StoredSession | null> {
  try {
    const [accessToken, expiresAtRaw, refreshToken, userJson] = await Promise.all([
      getItem(KEYS.accessToken),
      getItem(KEYS.accessExpiresAt),
      getItem(KEYS.refreshToken),
      getItem(KEYS.user),
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
    deleteItem(KEYS.accessToken),
    deleteItem(KEYS.accessExpiresAt),
    deleteItem(KEYS.refreshToken),
    deleteItem(KEYS.user),
  ]);
}

export async function getRefreshToken(): Promise<string | null> {
  return getItem(KEYS.refreshToken);
}

export async function getAccessSnapshot(): Promise<{ token: string | null; expiresAt: number }> {
  const [token, expiresAtRaw] = await Promise.all([
    getItem(KEYS.accessToken),
    getItem(KEYS.accessExpiresAt),
  ]);
  return { token, expiresAt: Number(expiresAtRaw) || 0 };
}

/** ID của thiết bị: sinh một lần ở lần chạy đầu rồi dùng lại mãi. */
export async function getDeviceId(): Promise<string> {
  const existing = await getItem(KEYS.deviceId);
  if (existing) return existing;
  const id = Crypto.randomUUID();
  await setItem(KEYS.deviceId, id);
  return id;
}