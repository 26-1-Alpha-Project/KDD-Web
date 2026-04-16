import { delay } from '@/lib/api/mock';
import { authManager } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/errors';
import type { LoginResponse } from '@/types/api/auth';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const MOCK_LOGIN_RESPONSE: LoginResponse = {
  accessToken: 'mock-access-token',
  isProfileCompleted: false,
};

const MOCK_LOGIN_RESPONSE_COMPLETED: LoginResponse = {
  accessToken: 'mock-access-token-completed',
  isProfileCompleted: true,
};

/**
 * Auth API는 refreshToken 쿠키(Path=/auth)가 전송되려면
 * 요청 경로가 /auth/*이어야 하므로 apiClient(/api/backend) 대신 직접 fetch 사용.
 * next.config.ts rewrites: /auth/google → backend, /auth/refresh → backend, /auth/logout → backend
 */

async function authFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...options,
    credentials: 'include',
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({
      error: 'UNKNOWN_ERROR',
      message: '알 수 없는 오류가 발생했습니다.',
    }));
    throw new ApiError(response.status, body.error, body.message);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}

export async function googleLogin(code: string): Promise<LoginResponse> {
  if (USE_MOCK) {
    await delay(500);
    return code === 'completed' ? MOCK_LOGIN_RESPONSE_COMPLETED : MOCK_LOGIN_RESPONSE;
  }
  return authFetch<LoginResponse>('/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
}

export async function logout(): Promise<void> {
  if (USE_MOCK) {
    await delay(200);
    return;
  }
  const token = authManager.getToken();
  await authFetch<unknown>('/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
