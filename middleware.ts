import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 인증 + role 기반 라우팅 가드
// TODO: 실제 세션/토큰 검증 로직 구현
// 보호 대상:
//   - (main) 라우트 → 로그인 필요
//   - /admin/** → role === 'admin' 필요
export function middleware(request: NextRequest) {
  // TODO: 세션 확인
  // TODO: 비로그인 → /login 리다이렉트
  // TODO: 비관리자 → /chat 리다이렉트
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/chat/:path*",
    "/faq/:path*",
    "/resources/:path*",
    "/settings/:path*",
    "/admin/:path*",
  ],
};
