// src/services/conversations.ts
// import { getAccessSnapshot  } from '@/lib/token-storage';
import { authedRequest } from './session';
import type { ConversationSummary } from './types';

export async function listConversations(): Promise<ConversationSummary[]> {
  return authedRequest<ConversationSummary[]>('/api/v1/conversations', {
    method: 'GET',
  });
}
