// src/services/types.ts
// Khớp với UserDto và AuthResponse của backend

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  /** Thời gian sống của access token, đơn vị giây */
  expiresIn: number;
}
