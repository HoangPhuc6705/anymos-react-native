// src/services/auth.ts
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { getAccessToken, getDeviceId } from '@/lib/token-storage';
import { apiRequest } from './api';
import type { AuthResponse } from './types';

/** Thông tin thiết bị gửi kèm để backend ghi vào user_sessions. */
async function getDeviceInfo() {
  return {
    deviceId: await getDeviceId(),
    deviceName: (Device.deviceName ?? Device.modelName ?? Platform.OS).slice(0, 100),
    platform: Platform.OS,
  };
}

export async function register(input: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/api/v1/auth/register', {
    body: { ...input, ...(await getDeviceInfo()) },
  });
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/api/v1/auth/login', {
    body: { ...input, ...(await getDeviceInfo()) },
  });
}

/**
 * Báo backend thu hồi phiên hiện tại. Lỗi (mất mạng, token hết hạn) được bỏ qua
 * vì dù sao app cũng sẽ xóa token ở máy.
 */
export async function logout(): Promise<void> {
  const token = await getAccessToken();
  if (!token) return;
  try {
    await apiRequest('/api/v1/auth/logout', { token });
  } catch {
    // bỏ qua
  }
}
