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

export interface ConversationSummary {
  id: number;
  /** Backend trả về chữ thường: 'direct' | 'group' */
  type: 'direct' | 'group';
  /** direct: tên/nickname người kia. group: tên nhóm (có thể null). */
  name: string | null;
  avatarUrl: string | null;
  /** Chỉ có với chat direct */
  peerUserId: number | null;
  lastMessagePreview: string | null;
  /** ISO-8601 có offset, ví dụ 2026-09-29T20:42:00+07:00 */
  lastMessageAt: string | null;
  unreadCount: number;
}
