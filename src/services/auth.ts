// src/services/auth.ts
import { getDeviceId } from "@/lib/token-storage";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { apiRequest } from "./api";
import { authedRequest } from "./session";
import type { AuthResponse } from "./types";

/** Thông tin thiết bị gửi kèm để backend ghi vào user_sessions. */
async function getDeviceInfo() {
  return {
    deviceId: await getDeviceId(),
    deviceName: (Device.deviceName ?? Device.modelName ?? Platform.OS).slice(
      0,
      100,
    ),
    platform: Platform.OS,
  };
}

export async function register(input: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/api/v1/auth/register", {
    body: { ...input, ...(await getDeviceInfo()) },
  });
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/api/v1/auth/login", {
    body: { ...input, ...(await getDeviceInfo()) },
  });
}

/**
 * Báo backend thu hồi phiên hiện tại (tự làm mới token nếu đã hết hạn).
 * Lỗi bị bỏ qua vì dù sao app cũng sẽ xóa token ở máy; chờ tối đa 6 giây
 * để mạng chậm không làm nút Đăng xuất bị treo.
 */
export async function logout(): Promise<void> {
  try {
    await Promise.race([
      authedRequest("/api/v1/auth/logout", { timeoutMs: 5000 }),
      new Promise<void>((resolve) => setTimeout(resolve, 6000)),
    ]);
  } catch {
    // bỏ qua
  }
}
