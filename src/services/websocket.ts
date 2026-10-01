// src/services/websocket.ts
// Quản lý kết nối STOMP WebSocket đến backend Spring Boot.
// Dùng @stomp/stompjs với WebSocket native của React Native (không cần SockJS).

import { Client, type IFrame, type IMessage } from '@stomp/stompjs';
import { API_BASE_URL } from '@/lib/config';
import { getValidAccessToken } from './session';

/** Chuyển http(s):// → ws(s):// rồi nối đường dẫn /ws */
function buildWsUrl(): string {
  return API_BASE_URL.replace(/^http/, 'ws') + '/ws';
}

type MessageHandler = (body: any) => void;
type ConnectionHandler = () => void;

interface Subscription {
  destination: string;
  handler: MessageHandler;
  id?: string;
}

let client: Client | null = null;
let subscriptions: Subscription[] = [];
let onConnectHandlers: ConnectionHandler[] = [];
let onDisconnectHandlers: ConnectionHandler[] = [];
let isConnecting = false;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Kết nối WebSocket tới backend. Gọi một lần sau khi đăng nhập.
 * Token sẽ được tự lấy từ session service.
 */
export async function connectWebSocket(): Promise<void> {
  if (client?.connected || isConnecting) return;

  isConnecting = true;

  try {
    const token = await getValidAccessToken();
    const wsUrl = buildWsUrl();

    if (__DEV__) console.log('[ws] đang kết nối đến', wsUrl);

    client = new Client({
      brokerURL: wsUrl,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      // React Native có WebSocket native, không cần polyfill
      forceBinaryWSFrames: true,
      appendMissingNULLonIncoming: true,

      // Heartbeat: kiểm tra kết nối mỗi 10s
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      // Tự reconnect sau 5s nếu mất kết nối
      reconnectDelay: 5000,

      // Cần cung cấp beforeConnect để refresh token trước mỗi lần reconnect
      beforeConnect: async () => {
        try {
          const freshToken = await getValidAccessToken();
          if (client) {
            client.connectHeaders = {
              Authorization: `Bearer ${freshToken}`,
            };
          }
        } catch (err) {
          if (__DEV__) console.log('[ws] không lấy được token khi reconnect', err);
        }
      },

      onConnect: (_frame: IFrame) => {
        isConnecting = false;
        if (__DEV__) console.log('[ws] đã kết nối thành công');

        // Đăng ký lại tất cả các subscription
        resubscribeAll();

        onConnectHandlers.forEach((h) => h());
      },

      onDisconnect: () => {
        isConnecting = false;
        if (__DEV__) console.log('[ws] ngắt kết nối');
        onDisconnectHandlers.forEach((h) => h());
      },

      onStompError: (frame: IFrame) => {
        isConnecting = false;
        if (__DEV__) console.log('[ws] STOMP lỗi:', frame.headers['message'], frame.body);
      },

      onWebSocketError: (event) => {
        isConnecting = false;
        if (__DEV__) console.log('[ws] WebSocket lỗi:', event);
      },
    });

    client.activate();
  } catch (err) {
    isConnecting = false;
    if (__DEV__) console.log('[ws] kết nối thất bại:', err);
    throw err;
  }
}

/** Ngắt kết nối WebSocket. Gọi khi đăng xuất. */
export function disconnectWebSocket(): void {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  subscriptions = [];
  onConnectHandlers = [];
  onDisconnectHandlers = [];

  if (client) {
    client.deactivate();
    client = null;
  }
  isConnecting = false;
}

/**
 * Subscribe vào một destination và nhận tin nhắn qua handler.
 * Nếu đang connected thì subscribe ngay, nếu chưa thì sẽ subscribe khi connect.
 * Trả về hàm unsubscribe.
 */
export function subscribe(destination: string, handler: MessageHandler): () => void {
  const sub: Subscription = { destination, handler };
  subscriptions.push(sub);

  // Nếu đã connected, subscribe ngay
  if (client?.connected) {
    doSubscribe(sub);
  }

  // Trả về hàm unsubscribe
  return () => {
    // Gỡ STOMP subscription nếu có
    if (sub.id && client?.connected) {
      try {
        client.unsubscribe(sub.id);
      } catch {
        // bỏ qua nếu đã mất kết nối
      }
    }
    // Gỡ khỏi danh sách
    subscriptions = subscriptions.filter((s) => s !== sub);
  };
}

/** Gửi tin nhắn qua STOMP. */
export function publish(destination: string, body: unknown): void {
  if (!client?.connected) {
    if (__DEV__) console.warn('[ws] chưa kết nối, không gửi được đến', destination);
    return;
  }

  client.publish({
    destination,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/** Đăng ký callback khi kết nối thành công. */
export function onConnect(handler: ConnectionHandler): () => void {
  onConnectHandlers.push(handler);
  return () => {
    onConnectHandlers = onConnectHandlers.filter((h) => h !== handler);
  };
}

/** Đăng ký callback khi ngắt kết nối. */
export function onDisconnect(handler: ConnectionHandler): () => void {
  onDisconnectHandlers.push(handler);
  return () => {
    onDisconnectHandlers = onDisconnectHandlers.filter((h) => h !== handler);
  };
}

/** Trả về trạng thái kết nối hiện tại. */
export function isConnected(): boolean {
  return client?.connected ?? false;
}

// ── Internal helpers ──────────────────────────────────────────────────

function doSubscribe(sub: Subscription): void {
  if (!client?.connected) return;

  const stompSub = client.subscribe(sub.destination, (message: IMessage) => {
    try {
      const parsed = message.body ? JSON.parse(message.body) : null;
      sub.handler(parsed);
    } catch {
      sub.handler(message.body);
    }
  });

  sub.id = stompSub.id;
}

function resubscribeAll(): void {
  for (const sub of subscriptions) {
    doSubscribe(sub);
  }
}
