// src/services/friends.ts
// Gọi API kết bạn của backend (FriendController + UserSearchController).
import { ApiError } from "./api";
import { authedRequest } from "./session";
import type { AuthUser } from "./types";

export type FriendSearchMode = "friends" | "email";

/** Khớp UserSearchResultDto.Relationship của backend. */
export type FriendRelationship =
  | "NONE" // chưa có quan hệ: có thể gửi lời mời
  | "FRIEND" // đã là bạn bè
  | "PENDING_SENT" // mình đã gửi, đang chờ đối phương
  | "PENDING_RECEIVED"; // đối phương đã gửi cho mình

/** Khớp UserSearchResultDto. */
export interface UserSearchResult extends AuthUser {
  relationship: FriendRelationship;
  /** Có khi đã có quan hệ (dùng cho accept/reject), ngược lại null. */
  friendshipId: number | null;
}

export type FriendshipStatus = "PENDING" | "ACCEPTED" | "BLOCKED";

/** Khớp FriendshipDto. */
export interface Friendship {
  id: number;
  user: AuthUser;
  friend: AuthUser;
  /** Người thực hiện hành động gần nhất; với PENDING chính là người gửi lời mời. */
  actionUserId: number;
  status: FriendshipStatus;
  /** LocalDateTime của backend: không có múi giờ, ví dụ 2026-09-30T04:32:10.123456 */
  createdAt: string;
  updatedAt: string;
}

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Cùng quy tắc với backend (UserSearchService): tránh gọi API khi email chưa gõ xong. */
export function isValidEmail(value: string): boolean {
  const email = value.trim();
  return email.length > 0 && email.length <= 255 && EMAIL_REGEX.test(email);
}

export function errorMessage(err: unknown): string {
  return err instanceof ApiError ? err.message : "Có lỗi xảy ra, vui lòng thử lại.";
}

/** Trả về user còn lại trong một friendship. */
export function otherUserOf(f: Friendship, myId: number): AuthUser {
  return f.user.id === myId ? f.friend : f.user;
}

/** Người gửi lời mời (actionUser) của một friendship đang PENDING. */
export function senderOf(f: Friendship): AuthUser {
  return f.user.id === f.actionUserId ? f.user : f.friend;
}

// ── API ─────────────────────────────────────────────────────────────────

/** GET /api/v1/users/search?email=  → mảng 0 hoặc 1 phần tử (khớp chính xác). */
export function searchUsersByEmail(email: string): Promise<UserSearchResult[]> {
  return authedRequest<UserSearchResult[]>(
    `/api/v1/friends/search?email=${encodeURIComponent(email.trim())}`,
    { method: "GET" },
  );
}

/** POST /api/v1/friends/request */
export function sendFriendRequest(friendId: number): Promise<Friendship> {
  return authedRequest<Friendship>("/api/v1/friends/request", {
    method: "POST",
    body: { friendId },
  });
}

/** GET /api/v1/friends/requests/pending: lời mời nhận được, đang chờ. */
export function getPendingRequests(): Promise<Friendship[]> {
  return authedRequest<Friendship[]>("/api/v1/friends/requests/pending", {
    method: "GET",
  });
}

/** POST /api/v1/friends/{id}/accept */
export function acceptFriendRequest(friendshipId: number): Promise<Friendship> {
  return authedRequest<Friendship>(`/api/v1/friends/${friendshipId}/accept`, {
    method: "POST",
  });
}

/** DELETE /api/v1/friends/{id}/reject → 204 */
export function rejectFriendRequest(friendshipId: number): Promise<void> {
  return authedRequest<void>(`/api/v1/friends/${friendshipId}/reject`, {
    method: "DELETE",
  });
}

/** GET /api/v1/friends: danh sách bạn bè đã chấp nhận. */
export function getFriends(): Promise<Friendship[]> {
  return authedRequest<Friendship[]>("/api/v1/friends", { method: "GET" });
}