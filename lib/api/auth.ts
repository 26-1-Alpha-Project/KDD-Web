/**
 * Auth Manager - 토큰 관리
 *
 * Access Token의 메모리 저장, JWT 만료시간 디코딩,
 * 자동 재발급 스케줄링, 동시 요청 중복 방지를 담당한다.
 */

import type { RefreshResponse } from '@/types/api/auth';

class AuthManager {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private refreshPromise: Promise<string> | null = null;
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * JWT 토큰을 메모리에 저장하고 만료시간을 추출하여 자동 재발급을 스케줄링한다.
   * mock 토큰(유효한 JWT가 아닌 경우)은 만료시간 없이 저장만 한다.
   */
  setToken(token: string): void {
    this.accessToken = token;
    this.tokenExpiry = this.decodeTokenExpiry(token);

    // 유효한 JWT가 아닌 경우(mock 토큰 등) 재발급 스케줄링을 건너뛴다
    if (this.tokenExpiry > 0) {
      this.scheduleRefresh();
    }
  }

  /**
   * 현재 저장된 Access Token을 반환한다.
   */
  getToken(): string | null {
    return this.accessToken;
  }

  /**
   * 토큰을 삭제하고 재발급 타이머를 해제한다.
   */
  clearToken(): void {
    this.accessToken = null;
    this.tokenExpiry = 0;
    this.refreshPromise = null;

    if (this.refreshTimer !== null) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * 토큰이 존재하고 아직 만료되지 않았는지 확인한다.
   * mock 토큰(tokenExpiry === 0)은 토큰 존재 여부만 확인한다.
   */
  isAuthenticated(): boolean {
    if (this.accessToken === null) return false;
    if (this.tokenExpiry === 0) return true; // mock 토큰
    return Date.now() < this.tokenExpiry;
  }

  /**
   * JWT payload에서 만료시간(exp)을 디코딩하여 밀리초 타임스탬프로 반환한다.
   * JWT 형식: header.payload.signature
   * payload의 exp 클레임은 초 단위이므로 1000을 곱하여 밀리초로 변환한다.
   */
  private decodeTokenExpiry(token: string): number {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return 0;
      }

      // Base64url → Base64 변환 후 디코딩
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));

      if (typeof payload.exp !== 'number') {
        return 0;
      }

      return payload.exp * 1000;
    } catch {
      return 0;
    }
  }

  /**
   * 토큰 만료 5분 전에 자동 재발급을 스케줄링한다.
   * 이미 타이머가 설정되어 있으면 기존 타이머를 해제하고 새로 설정한다.
   * delay가 0 이하이면 즉시 재발급을 실행한다.
   */
  private scheduleRefresh(): void {
    if (this.refreshTimer !== null) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }

    const delay = this.tokenExpiry - Date.now() - 5 * 60 * 1000;

    if (delay <= 0) {
      this.refreshAccessToken().catch(() => {
        // 재발급 실패 시 clearToken에서 처리됨
      });
      return;
    }

    this.refreshTimer = setTimeout(() => {
      this.refreshAccessToken().catch(() => {
        // 재발급 실패 시 clearToken에서 처리됨
      });
    }, delay);
  }

  /**
   * Access Token을 재발급한다.
   * 이미 재발급 요청이 진행 중이면 기존 Promise를 반환하여 중복 요청을 방지한다.
   * fetch를 직접 사용하여 apiClient와의 순환 의존성을 방지한다.
   */
  async refreshAccessToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.executeRefresh();

    return this.refreshPromise;
  }

  private async executeRefresh(): Promise<string> {
    const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000').replace(/\/+$/, '');
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

    // Mock 모드에서는 실제 네트워크 요청 없이 mock 토큰 반환
    if (useMock) {
      const mockToken = 'mock-refreshed-token';
      this.accessToken = mockToken;
      this.tokenExpiry = 0; // mock 토큰은 만료 없음
      return mockToken;
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Refresh failed with status ${response.status}`);
      }

      const data: RefreshResponse = await response.json();
      this.setToken(data.accessToken);
      return data.accessToken;
    } catch (error) {
      this.clearToken();
      throw error;
    } finally {
      this.refreshPromise = null;
    }
  }
}

export const authManager = new AuthManager();
