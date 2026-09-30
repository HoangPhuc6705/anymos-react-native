// src/services/chat.ts
// Service gọi REST API và STOMP WebSocket cho chức năng nhắn tin.

import { authedRequest } from './session';
import { subscribe, publish } from './websocket';

// ── Types ──────────────────────────────────────────────────────────────

export interface ChatMessage {
  /** ID tài liệu Firestore (hoặc số tự tăng tuỳ backend) */
  id: string;
  senderId: number;
  content: string;
  type: string;
  /** ISO-8601 string */
  createdAt: string;
}

export interface SendMessagePayload {
  conversationId: number;
  content: string;
  type?: string;
}

// ── REST API ───────────────────────────────────────────────────────────

/**
 * Lấy lịch sử tin nhắn qua REST API.
 * GET /api/conversations/{conversationId}/messages?limit=50
 */
export function getMessageHistory(
  conversationId: number,
  limit = 50,
): Promise<ChatMessage[]> {
  return authedRequest<ChatMessage[]>(
    `/api/conversations/${conversationId}/messages?limit=${limit}`,
    { method: 'GET' },
  );
}

// ── WebSocket (STOMP) ──────────────────────────────────────────────────

/**
 * Subscribe vào topic tin nhắn của một cuộc trò chuyện.
 * Backend broadcast đến /chat/conversations/{conversationId}
 * Trả về hàm unsubscribe.
 */
export function subscribeToConversation(
  conversationId: number,
  onMessage: (message: ChatMessage) => void,
): () => void {
  return subscribe(`/chat/conversations/${conversationId}`, onMessage);
}

/**
 * Gửi tin nhắn qua STOMP WebSocket.
 * Backend nhận ở @MessageMapping("/chat.sendMessage")
 */
export function sendMessage(payload: SendMessagePayload): void {
  publish('/app/chat.sendMessage', {
    conversationId: payload.conversationId,
    content: payload.content,
    type: payload.type ?? 'TEXT',
  });
}

// ── Friend Notifications (WebSocket) ───────────────────────────────────

export interface FriendNotification {
  type: 'FRIEND_REQUEST' | 'FRIEND_ACCEPTED' | 'FRIEND_REJECTED';
  friendshipId: number;
  fromUser: {
    id: number;
    username: string;
    email: string;
    avatarUrl: string | null;
    bio: string | null;
  };
  status: string | null;
  timestamp: string;
}

/**
 * Subscribe vào topic thông báo kết bạn.
 * Backend broadcast đến /friend/notifications/{userId}
 */
export function subscribeToFriendNotifications(
  userId: number,
  onNotification: (notification: FriendNotification) => void,
): () => void {
  return subscribe(`/friend/notifications/${userId}`, onNotification);
}
