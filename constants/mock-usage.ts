import type { ChatUsageResponse } from '@/types/api/usage';

export const MOCK_CHAT_USAGE: ChatUsageResponse = {
  dailyLimit: 30,
  usedToday: 15,
  remaining: 15,
  resetAt: '2026-04-17T00:00:00+09:00',
};
