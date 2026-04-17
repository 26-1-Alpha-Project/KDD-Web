import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js 16 proxy (미들웨어).
 *
 * user_role / profile_completed 쿠키를 라우팅 힌트로 사용한다.
 * 두 쿠키는 HttpOnly가 아니므로 클라이언트에서 document.cookie로 설정한다.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // OAuth 콜백 · auth 경로는 무조건 통과
  if (pathname.startsWith("/auth/") || pathname.startsWith("/callback")) {
    return NextResponse.next();
  }

  const userRole = request.cookies.get("user_role")?.value;
  const profileCompleted = request.cookies.get("profile_completed")?.value;

  const isAuthenticated = !!userRole;
  const isProfileCompleted = profileCompleted === "true";

  // /login: 이미 인증 완료된 사용자는 /chat으로 리다이렉트
  if (pathname === "/login") {
    if (isAuthenticated && isProfileCompleted) {
      return NextResponse.redirect(new URL("/chat", request.url));
    }
    return NextResponse.next();
  }

  // 인증이 필요한 경로 처리
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!isProfileCompleted) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // /admin: admin이 아니면 /chat으로 리다이렉트
  if (pathname.startsWith("/admin") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/chat/:path*",
    "/faq/:path*",
    "/resources/:path*",
    "/settings/:path*",
    "/admin/:path*",
  ],
};
