// src/services/session.ts
// Quản lý vòng đời access token: làm mới bằng refresh token và gọi API kèm token hợp lệ.
import { getAccessSnapshot, getRefreshToken, saveSession } from '@/lib/token-storage';
import { ApiError, apiRequest, type RequestOptions } from './api';
import type { AuthResponse } from './types';

/** Làm mới sớm hơn hạn 60 giây để request đang bay không bị hết hạn giữa đường. */
export const REFRESH_SKEW_MS = 60_000;

interface SessionListener {
  /** Gọi sau mỗi lần làm mới thành công (dù do timer hay do request bị 401) */
  onRefreshed?: (res: AuthResponse, accessExpiresAt: number) => void;
  /** Gọi khi refresh token không còn dùng được: phải đăng nhập lại */
  onExpired?: () => void;
}

let listener: SessionListener = {};

export function setSessionListener(next: SessionListener): void {
  listener = next;
}

/**
 * Lỗi 4xx (trừ 408, 429) nghĩa là server đã từ chối refresh token: phiên chết hẳn.
 * Mất mạng (status 0), timeout hoặc lỗi 5xx chỉ là tạm thời, cứ giữ phiên và thử lại sau.
 */
export function isFatalAuthError(err: unknown): boolean {
  return (
    err instanceof ApiError &&
    err.status >= 400 &&
    err.status < 500 &&
    err.status !== 408 &&
    err.status !== 429
  );
}

let inflight: Promise<AuthResponse> | null = null;

/**
 * Đổi refresh token lấy cặp token mới. Nhiều nơi gọi cùng lúc chỉ gửi MỘT request:
 * server xoay vòng (rotation) refresh token, nên lần gọi thứ hai bằng token cũ sẽ bị từ chối.
 */
export function refreshSession(): Promise<AuthResponse> {
  if (!inflight) {
    inflight = doRefresh().finally(() => {
      inflight = null;
    });
  }
  return inflight;
}

async function doRefresh(): Promise<AuthResponse> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    listener.onExpired?.();
    throw new ApiError(401, 'NO_REFRESH_TOKEN', 'Chưa đăng nhập.');
  }

  try {
    const res = await apiRequest<AuthResponse>('/api/v1/auth/refresh', {
      body: { refreshToken },
    });

    // Trong lúc chờ phản hồi mà người dùng đã đăng xuất hoặc đăng nhập lại: bỏ kết quả này,
    // nếu không token cũ sẽ bị ghi lại vào máy sau khi đã xóa.
    if ((await getRefreshToken()) !== refreshToken) {
      throw new ApiError(0, 'SESSION_CHANGED', 'Phiên đăng nhập đã thay đổi.');
    }

    const accessExpiresAt = await saveSession(res);
    listener.onRefreshed?.(res, accessExpiresAt);
    return res;
  } catch (err) {
     console.log('[auth] refresh lỗi', (err as any)?.status, (err as any)?.code);
    if (isFatalAuthError(err)) listener.onExpired?.();
    throw err;
  }
}

/** Trả về access token còn dùng được, tự làm mới nếu sắp hoặc đã hết hạn. */
export async function getValidAccessToken(): Promise<string> {
  const { token, expiresAt } = await getAccessSnapshot();
  if (!token) throw new ApiError(401, 'UNAUTHORIZED', 'Chưa đăng nhập.');
  if (expiresAt - REFRESH_SKEW_MS > Date.now()) return token;

  try {
    return (await refreshSession()).accessToken;
  } catch (err) {
    // Làm mới lỗi tạm thời nhưng token cũ chưa thật sự hết hạn: dùng tiếp token cũ
    if (!isFatalAuthError(err) && expiresAt > Date.now()) return token;
    throw err;
  }
}

/**
 * Gọi API cần đăng nhập. Dùng hàm này cho MỌI request có token:
 * - Token sắp hết hạn thì làm mới trước khi gửi.
 * - Nếu server vẫn trả 401 TOKEN_EXPIRED thì làm mới rồi thử lại đúng một lần.
 */
export async function authedRequest<T = void>(
  path: string,
  options: Omit<RequestOptions, 'token'> = {},
): Promise<T> {
  const token = await getValidAccessToken();
  try {
    return await apiRequest<T>(path, { ...options, token });
  } catch (err) {
    if (err instanceof ApiError && err.status === 401 && err.code === 'TOKEN_EXPIRED') {
      const res = await refreshSession();
      return apiRequest<T>(path, { ...options, token: res.accessToken });
    }
    throw err;
  }
}
