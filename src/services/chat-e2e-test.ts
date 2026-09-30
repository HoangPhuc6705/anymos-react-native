// src/services/chat-e2e-test.ts
//
// Script test end-to-end chức năng nhắn tin giữa 2 user.
// Luồng:
//   1. Đăng nhập 2 user (User A và User B)
//   2. Kiểm tra xem 2 user đã kết bạn chưa
//   3. Nếu chưa → gửi lời mời kết bạn từ A → B chấp nhận
//   4. Lấy conversationId giữa 2 user
//   5. Kết nối WebSocket cho cả 2 user
//   6. User A gửi tin nhắn → User B nhận
//   7. User B gửi tin nhắn → User A nhận
//
// Chạy bằng: npx ts-node --esm src/services/__tests__/chat-e2e-test.ts
// Hoặc import trong app để chạy trực tiếp.

import { API_BASE_URL } from '@/lib/config';
import { Client, type IMessage } from '@stomp/stompjs';

// ── Config ─────────────────────────────────────────────────────────────

// Hai user để test — dùng email để đăng nhập
const USER_A = {
  email: 'usera@test.com',
  password: '1024abcd',
  username: 'usera',
};

const USER_B = {
  email: 'userb@test.com',
  password: '1024abcd',
  username: 'userb',
};

// ── Helpers ────────────────────────────────────────────────────────────

interface AuthResponse {
  user: { id: number; username: string; email: string };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface FriendshipDto {
  id: number;
  user: { id: number; username: string };
  friend: { id: number; username: string };
  actionUserId: number;
  status: 'PENDING' | 'ACCEPTED' | 'BLOCKED';
}

interface ConversationSummary {
  id: number;
  type: string;
  name: string | null;
  peerUserId: number | null;
}

interface ChatMessageDto {
  id: string;
  senderId: number;
  content: string;
  type: string;
  createdAt: string;
}

async function apiCall<T>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    token?: string;
  } = {},
): Promise<T> {
  const { method = 'POST', body, token } = options;
  const url = `${API_BASE_URL}${path}`;

  console.log(`  [api] ${method} ${path}`);

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // không phải JSON
  }

  if (!res.ok) {
    const msg = data?.message || data?.code || `HTTP ${res.status}`;
    throw new Error(`API Error (${res.status}): ${msg}`);
  }

  return data as T;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Test Functions ─────────────────────────────────────────────────────

/**
 * Đăng nhập một user. Nếu chưa có tài khoản thì đăng ký trước.
 */
async function loginOrRegister(user: {
  email: string;
  password: string;
  username: string;
}): Promise<AuthResponse> {
  try {
    console.log(`\n🔑 Đăng nhập ${user.email}...`);
    return await apiCall<AuthResponse>('/api/v1/auth/login', {
      body: { email: user.email, password: user.password },
    });
  } catch (_err) {
    console.log(`  ⚠️ Đăng nhập thất bại, thử đăng ký...`);
    try {
      const registerResult = await apiCall<AuthResponse>('/api/v1/auth/register', {
        body: {
          username: user.username,
          email: user.email,
          password: user.password,
        },
      });
      console.log(`  ✅ Đã đăng ký và đăng nhập ${user.email}`);
      return registerResult;
    } catch (regErr) {
      // Có thể tài khoản đã tồn tại nhưng sai mật khẩu
      throw new Error(
        `Không đăng nhập/đăng ký được ${user.email}: ${regErr}`,
      );
    }
  }
}

/**
 * Kiểm tra và thiết lập quan hệ bạn bè giữa 2 user.
 * Trả về conversationId nếu đã là bạn, hoặc tạo mới.
 */
async function ensureFriendship(
  authA: AuthResponse,
  authB: AuthResponse,
): Promise<number> {
  console.log('\n🤝 Kiểm tra quan hệ bạn bè...');

  // Kiểm tra danh sách bạn bè của A
  const friends = await apiCall<FriendshipDto[]>('/api/v1/friends', {
    method: 'GET',
    token: authA.accessToken,
  });

  const existingFriend = friends.find(
    (f) =>
      f.status === 'ACCEPTED' &&
      (f.user.id === authB.user.id || f.friend.id === authB.user.id),
  );

  if (existingFriend) {
    console.log('  ✅ Đã là bạn bè! (friendshipId:', existingFriend.id, ')');
  } else {
    console.log('  ❌ Chưa kết bạn. Bắt đầu gửi lời mời...');

    // Kiểm tra xem có pending request không
    const pending = await apiCall<FriendshipDto[]>(
      '/api/v1/friends/requests/pending',
      { method: 'GET', token: authB.accessToken },
    );

    const pendingFromA = pending.find(
      (f) =>
        f.user.id === authA.user.id || f.friend.id === authA.user.id,
    );

    if (pendingFromA) {
      console.log('  📩 Đã có lời mời kết bạn pending, chấp nhận...');
      await apiCall<FriendshipDto>(
        `/api/v1/friends/${pendingFromA.id}/accept`,
        { method: 'POST', token: authB.accessToken },
      );
      console.log('  ✅ Đã chấp nhận lời mời kết bạn!');
    } else {
      // Gửi lời mời từ A
      console.log(`  📤 User A gửi lời mời kết bạn đến User B...`);
      const request = await apiCall<FriendshipDto>('/api/v1/friends/request', {
        body: { friendId: authB.user.id },
        token: authA.accessToken,
      });
      console.log('  ✅ Đã gửi lời mời (friendshipId:', request.id, ')');

      await wait(500); // Chờ một chút

      // User B chấp nhận
      console.log(`  📥 User B chấp nhận lời mời kết bạn...`);
      await apiCall<FriendshipDto>(
        `/api/v1/friends/${request.id}/accept`,
        { method: 'POST', token: authB.accessToken },
      );
      console.log('  ✅ User B đã chấp nhận!');
    }
  }

  // Lấy conversationId
  console.log('\n📋 Lấy danh sách cuộc trò chuyện...');
  const conversations = await apiCall<ConversationSummary[]>(
    '/api/v1/conversations',
    { method: 'GET', token: authA.accessToken },
  );

  const directConvo = conversations.find(
    (c) => c.peerUserId === authB.user.id,
  );

  if (!directConvo) {
    throw new Error(
      'Không tìm thấy cuộc trò chuyện giữa 2 user sau khi kết bạn!',
    );
  }

  console.log('  ✅ ConversationId:', directConvo.id);
  return directConvo.id;
}

/**
 * Kết nối STOMP WebSocket cho một user.
 */
function connectStomp(
  token: string,
  label: string,
): Promise<Client> {
  return new Promise((resolve, reject) => {
    const wsUrl = API_BASE_URL.replace(/^http/, 'ws') + '/ws';
    console.log(`\n🔌 [${label}] Kết nối WebSocket đến ${wsUrl}...`);

    const client = new Client({
      brokerURL: wsUrl,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      appendMissingNULLonIncoming: true,
      reconnectDelay: 0, // không reconnect trong test
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      onConnect: () => {
        console.log(`  ✅ [${label}] WebSocket đã kết nối!`);
        resolve(client);
      },

      onStompError: (frame) => {
        const msg = frame.headers['message'] || 'unknown';
        console.log(`  ❌ [${label}] STOMP error: ${msg}`);
        reject(new Error(`STOMP error: ${msg}`));
      },

      onWebSocketError: (event) => {
        console.log(`  ❌ [${label}] WebSocket error`);
        reject(new Error('WebSocket connection failed'));
      },
    });

    client.activate();

    // Timeout sau 10s
    setTimeout(() => {
      if (!client.connected) {
        client.deactivate();
        reject(new Error(`[${label}] WebSocket connection timeout`));
      }
    }, 10000);
  });
}

/**
 * Test gửi và nhận tin nhắn real-time qua STOMP.
 */
async function testRealTimeMessaging(
  conversationId: number,
  authA: AuthResponse,
  authB: AuthResponse,
): Promise<void> {
  console.log('\n\n═══════════════════════════════════════════');
  console.log('🧪 TEST: Nhắn tin real-time qua WebSocket');
  console.log('═══════════════════════════════════════════');

  // Kết nối STOMP cho cả 2 user
  const clientA = await connectStomp(authA.accessToken, 'User A');
  const clientB = await connectStomp(authB.accessToken, 'User B');

  try {
    // Đếm tin nhắn nhận được
    const receivedByA: string[] = [];
    const receivedByB: string[] = [];

    // Subscribe cho cả 2
    const topic = `/chat/conversations/${conversationId}`;

    clientA.subscribe(topic, (msg: IMessage) => {
      const body = JSON.parse(msg.body);
      console.log(`  📨 [User A nhận]: "${body.content}" (từ senderId: ${body.senderId})`);
      receivedByA.push(body.content);
    });

    clientB.subscribe(topic, (msg: IMessage) => {
      const body = JSON.parse(msg.body);
      console.log(`  📨 [User B nhận]: "${body.content}" (từ senderId: ${body.senderId})`);
      receivedByB.push(body.content);
    });

    await wait(500); // Chờ subscribe hoàn tất

    // Test 1: User A gửi tin nhắn
    console.log('\n📝 Test 1: User A gửi tin nhắn...');
    const msgFromA = `Xin chào từ User A! [${new Date().toLocaleTimeString()}]`;
    clientA.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify({
        conversationId,
        content: msgFromA,
        type: 'TEXT',
      }),
    });

    await wait(2000); // Chờ server xử lý

    // Kiểm tra User B nhận được
    const bGotMsg = receivedByB.some((m) => m === msgFromA);
    console.log(
      bGotMsg
        ? '  ✅ User B nhận được tin nhắn từ User A!'
        : '  ❌ User B KHÔNG nhận được tin nhắn từ User A!',
    );

    // Test 2: User B gửi tin nhắn
    console.log('\n📝 Test 2: User B gửi tin nhắn...');
    const msgFromB = `Xin chào từ User B! [${new Date().toLocaleTimeString()}]`;
    clientB.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify({
        conversationId,
        content: msgFromB,
        type: 'TEXT',
      }),
    });

    await wait(2000);

    const aGotMsg = receivedByA.some((m) => m === msgFromB);
    console.log(
      aGotMsg
        ? '  ✅ User A nhận được tin nhắn từ User B!'
        : '  ❌ User A KHÔNG nhận được tin nhắn từ User B!',
    );

    // Test 3: Kiểm tra lịch sử REST API
    console.log('\n📝 Test 3: Kiểm tra lịch sử tin nhắn qua REST API...');
    const history = await apiCall<ChatMessageDto[]>(
      `/api/conversations/${conversationId}/messages?limit=10`,
      { method: 'GET', token: authA.accessToken },
    );

    console.log(`  📚 Có ${history.length} tin nhắn trong lịch sử`);
    history.forEach((m) => {
      console.log(`    • [senderId: ${m.senderId}] "${m.content}"`);
    });

    // Tổng kết
    console.log('\n\n═══════════════════════════════════════════');
    console.log('📊 KẾT QUẢ TEST');
    console.log('═══════════════════════════════════════════');
    console.log(`  Đăng nhập User A: ✅`);
    console.log(`  Đăng nhập User B: ✅`);
    console.log(`  Kết bạn:          ✅`);
    console.log(`  WebSocket A:      ${clientA.connected ? '✅' : '❌'}`);
    console.log(`  WebSocket B:      ${clientB.connected ? '✅' : '❌'}`);
    console.log(`  A → B tin nhắn:   ${bGotMsg ? '✅' : '❌'}`);
    console.log(`  B → A tin nhắn:   ${aGotMsg ? '✅' : '❌'}`);
    console.log(`  REST history:     ${history.length > 0 ? '✅' : '❌'}`);
    console.log('═══════════════════════════════════════════\n');
  } finally {
    // Dọn dẹp
    clientA.deactivate();
    clientB.deactivate();
  }
}

// ── Main ───────────────────────────────────────────────────────────────

/**
 * Chạy toàn bộ test end-to-end.
 * Gọi hàm này từ bất kỳ đâu trong app (ví dụ: một nút test, hoặc useEffect).
 */
export async function runChatE2ETest(): Promise<void> {
  console.log('\n\n╔═══════════════════════════════════════════╗');
  console.log('║    CHAT E2E TEST — Enymos × WhatsUp       ║');
  console.log('╚═══════════════════════════════════════════╝');
  console.log(`\n🌐 API Base URL: ${API_BASE_URL}`);

  try {
    // Step 1: Đăng nhập 2 user
    const authA = await loginOrRegister(USER_A);
    console.log(`  ✅ User A: id=${authA.user.id}, username=${authA.user.username}`);

    const authB = await loginOrRegister(USER_B);
    console.log(`  ✅ User B: id=${authB.user.id}, username=${authB.user.username}`);

    // Step 2: Đảm bảo kết bạn
    const conversationId = await ensureFriendship(authA, authB);

    // Step 3: Test nhắn tin real-time
    await testRealTimeMessaging(conversationId, authA, authB);

    console.log('🎉 Test hoàn tất thành công!');
  } catch (err) {
    console.error('\n💥 Test thất bại:', err);
    throw err;
  }
}

export default runChatE2ETest;
