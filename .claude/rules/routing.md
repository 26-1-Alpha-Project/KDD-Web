---
globs: ["app/**/*.tsx", "middleware.ts"]
---

# Next.js App Router 규칙

## 라우트 그룹
- `(auth)` — 인증 전 접근 (로그인)
- `(main)` — 인증 후 접근 (사이드바 레이아웃 포함)
- `admin/` — 관리자 전용

## 페이지
- `page.tsx`는 `default export` 사용
- 컴포넌트 이름: `XxxPage` (예: `ChatPage`, `LoginPage`)
- 비즈니스 로직 최소화 → 컴포넌트/훅으로 위임

## 레이아웃
- `layout.tsx`는 공통 레이아웃만 담당
- `(main)/layout.tsx`: SidebarContext + Sidebar 제공
- `admin/layout.tsx`: 관리자 전용 네비게이션

## 미들웨어
- `middleware.ts`는 인증/role 라우팅 가드 전용
- matcher 패턴으로 대상 경로 제한

## 리다이렉트
- 서버 컴포넌트: `redirect()` (next/navigation)
- 클라이언트: `useRouter().push()`
