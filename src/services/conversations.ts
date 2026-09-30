// src/services/conversations.ts
import { getAccessToken } from '@/lib/token-storage';
import { apiRequest } from './api';
import type { ConversationSummary } from './types';

/** Danh sách cuộc trò chuyện của người dùng hiện tại, mới nhất lên trước. */
export async function listConversations(): Promise<ConversationSummary[]> {
  const token = await getAccessToken();
  return apiRequest<ConversationSummary[]>('/api/v1/conversations', {
    method: 'GET',
    token,
  });
}
