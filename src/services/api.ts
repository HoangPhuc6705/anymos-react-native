// src/services/api.ts
import { API_BASE_URL } from "@/lib/config";

/** Lỗi trả về từ backend (khớp ErrorResponse) hoặc lỗi mạng. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  /** Có khi code = VALIDATION_ERROR: { tênTrường: thôngBáo } */
  readonly fieldErrors?: Record<string, string>;

  constructor(
    status: number,
    code: string,
    message: string,
    fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  /** Access token, gắn vào header Authorization */
  token?: string | null;
  timeoutMs?: number;
}

export async function apiRequest<T = void>(
  path: string,
  { method = "POST", body, token, timeoutMs = 15000 }: RequestOptions = {},
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (res.status === 204) return undefined as T;

    const text = await res.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      // body không phải JSON (ví dụ trang lỗi của proxy)
    }

    if (!res.ok) {
      throw new ApiError(
        res.status,
        data?.code ?? `HTTP_${res.status}`,
        data?.message ?? "Có lỗi xảy ra, vui lòng thử lại.",
        data?.errors,
      );
    }
    return data as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if ((err as { name?: string })?.name === "AbortError") {
      throw new ApiError(
        0,
        "TIMEOUT",
        "Máy chủ phản hồi quá lâu. Vui lòng thử lại.",
      );
    }
    throw new ApiError(
      0,
      "NETWORK_ERROR",
      "Không kết nối được máy chủ. Kiểm tra mạng và địa chỉ API.",
    );
  } finally {
    clearTimeout(timer);
  }
}
