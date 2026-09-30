// // src/context/auth-context.tsx
// import {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
//   type ReactNode,
// } from 'react';
// import { clearSession, loadSession, saveSession } from '@/lib/token-storage';
// import * as authApi from '@/services/auth';
// import type { AuthResponse, AuthUser } from '@/services/types';

// interface AuthContextValue {
//   user: AuthUser | null;
//   isAuthenticated: boolean;
//   /** true trong lúc đang đọc token đã lưu ở lần mở app */
//   isLoading: boolean;
//   /** Lưu phiên đăng nhập sau khi register/login thành công */
//   signIn: (res: AuthResponse) => Promise<void>;
//   signOut: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextValue | null>(null);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<AuthUser | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Khôi phục phiên đăng nhập khi mở app
//   useEffect(() => {
//     let cancelled = false;
//     loadSession()
//       .then((session) => {
//         if (!cancelled) setUser(session?.user ?? null);
//       })
//       .finally(() => {
//         if (!cancelled) setIsLoading(false);
//       });
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   const signIn = useCallback(async (res: AuthResponse) => {
//     await saveSession(res);
//     setUser(res.user);
//   }, []);

//   const signOut = useCallback(async () => {
//     await authApi.logout(); // báo backend thu hồi session (bỏ qua nếu lỗi)
//     await clearSession();
//     setUser(null);
//   }, []);

//   const value = useMemo<AuthContextValue>(
//     () => ({ user, isAuthenticated: user !== null, isLoading, signIn, signOut }),
//     [user, isLoading, signIn, signOut],
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth(): AuthContextValue {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth phải được dùng bên trong <AuthProvider>');
//   return ctx;
// }
// src/context/auth-context.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AppState } from 'react-native';
import { clearSession, loadSession, saveSession } from '@/lib/token-storage';
import { ApiError } from '@/services/api';
import * as authApi from '@/services/auth';
import {
  REFRESH_SKEW_MS,
  isFatalAuthError,
  refreshSession,
  setSessionListener,
} from '@/services/session';
import type { AuthResponse, AuthUser } from '@/services/types';

/** Sau mỗi lần làm mới, chờ ít nhất chừng này rồi mới làm mới tiếp (chống lặp dồn dập nếu token sống quá ngắn) */
const MIN_INTERVAL_MS = 10_000;
/** Mất mạng hoặc server lỗi: thử làm mới lại sau chừng này */
const RETRY_DELAY_MS = 30_000;

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** true trong lúc đang đọc token đã lưu ở lần mở app */
  isLoading: boolean;
  /** Lưu phiên đăng nhập sau khi register/login thành công */
  signIn: (res: AuthResponse) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** true khi đang đăng nhập; các callback bất đồng bộ dùng để tự bỏ qua sau khi đăng xuất */
  const activeRef = useRef(false);
  const expiresAtRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /** Đặt lịch làm mới access token sau delayMs mili-giây (thay lịch cũ nếu có). */
  const runRefreshIn = useCallback(
    (delayMs: number) => {
      clearTimer();
      if (__DEV__) {
        console.log(`[auth] sẽ làm mới access token sau ${Math.round(delayMs / 1000)}s`);
      }
      timerRef.current = setTimeout(async () => {
        if (!activeRef.current) return;
        try {
          await refreshSession(); // thành công: onRefreshed sẽ đặt lịch cho lần sau
        } catch (err) {
          if (!activeRef.current) return;
          if (isFatalAuthError(err)) return; // onExpired đã đưa người dùng về màn đăng nhập
          if (err instanceof ApiError && err.code === 'SESSION_CHANGED') return;
          runRefreshIn(RETRY_DELAY_MS); // mất mạng hoặc server lỗi: thử lại sau
        }
      }, delayMs);
    },
    [clearTimer],
  );

  // Nhận thông báo từ tầng session (làm mới thành công / phiên hết hạn)
  useEffect(() => {
    setSessionListener({
      onRefreshed: (res, accessExpiresAt) => {
        if (!activeRef.current) return;
        if (__DEV__) console.log('[auth] đã làm mới access token');
        expiresAtRef.current = accessExpiresAt;
        setUser(res.user);
        runRefreshIn(
          Math.max(accessExpiresAt - REFRESH_SKEW_MS - Date.now(), MIN_INTERVAL_MS),
        );
      },
      onExpired: () => {
        if (!activeRef.current) return;
        if (__DEV__) console.log('[auth] refresh token không còn hiệu lực, đăng xuất');
        activeRef.current = false;
        clearTimer();
        clearSession().finally(() => setUser(null)); // guard tự đưa về màn đăng nhập
      },
    });
    return () => setSessionListener({});
  }, [runRefreshIn, clearTimer]);

  // Khôi phục phiên đăng nhập khi mở app
  useEffect(() => {
    let cancelled = false;
    loadSession()
      .then((session) => {
        if (cancelled || !session) return;
        activeRef.current = true;
        expiresAtRef.current = session.accessExpiresAt;
        setUser(session.user);
        // Access token có thể đã hết hạn trong lúc app tắt: khi đó delay = 0 và làm mới ngay ở nền
        runRefreshIn(Math.max(session.accessExpiresAt - REFRESH_SKEW_MS - Date.now(), 0));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
      clearTimer();
    };
  }, [runRefreshIn, clearTimer]);

  // Timer bị treo khi app chạy nền, nên tính lại lịch mỗi khi quay lại app
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active' || !activeRef.current) return;
      runRefreshIn(Math.max(expiresAtRef.current - REFRESH_SKEW_MS - Date.now(), 0));
    });
    return () => sub.remove();
  }, [runRefreshIn]);

  const signIn = useCallback(
    async (res: AuthResponse) => {
      const accessExpiresAt = await saveSession(res);
      activeRef.current = true;
      expiresAtRef.current = accessExpiresAt;
      setUser(res.user);
      runRefreshIn(
        Math.max(accessExpiresAt - REFRESH_SKEW_MS - Date.now(), MIN_INTERVAL_MS),
      );
    },
    [runRefreshIn],
  );

  const signOut = useCallback(async () => {
    activeRef.current = false;
    clearTimer();
    await authApi.logout(); // báo backend thu hồi session (bỏ qua nếu lỗi)
    await clearSession();
    setUser(null);
  }, [clearTimer]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: user !== null, isLoading, signIn, signOut }),
    [user, isLoading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải được dùng bên trong <AuthProvider>');
  return ctx;
}
