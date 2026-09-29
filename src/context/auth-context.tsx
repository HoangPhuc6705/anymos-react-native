// src/context/auth-context.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { clearSession, loadSession, saveSession } from '@/lib/token-storage';
import * as authApi from '@/services/auth';
import type { AuthResponse, AuthUser } from '@/services/types';

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

  // Khôi phục phiên đăng nhập khi mở app
  useEffect(() => {
    let cancelled = false;
    loadSession()
      .then((session) => {
        if (!cancelled) setUser(session?.user ?? null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (res: AuthResponse) => {
    await saveSession(res);
    setUser(res.user);
  }, []);

  const signOut = useCallback(async () => {
    await authApi.logout(); // báo backend thu hồi session (bỏ qua nếu lỗi)
    await clearSession();
    setUser(null);
  }, []);

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
