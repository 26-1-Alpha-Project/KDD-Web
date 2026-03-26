---
globs: ["**/*.tsx", "**/*.css"]
---

# 스타일링 규칙

## Tailwind CSS 4
- `@import "tailwindcss"` 문법 (v3의 `@tailwind` 아님)
- `@theme inline` 블록으로 디자인 토큰 매핑 (`app/globals.css` 참조)
- `@apply` 최소화 — 유틸리티 클래스 직접 사용

## 디자인 토큰 (CSS 변수)
- 색상은 CSS 변수 사용: `bg-primary`, `text-foreground`, `border-border`
- 하드코딩 색상 금지 (예외: `black/10`, `black/40` 등 투명도 변형)
- 프로젝트 색상:
  - `--primary: #004f9f` (국민대 블루)
  - `--background: #ffffff`
  - `--foreground: #1a1a1a`
- 반지름: `--radius: 0.5rem` 기반

## 클래스 유틸리티
- 조건부 클래스: `cn()` 사용 (`@/lib/utils`)
  ```tsx
  className={cn("base-classes", condition && "conditional-classes")}
  ```
- 변형 컴포넌트: `cva()` (class-variance-authority)
- `clsx` 직접 사용 금지 → `cn()` 래퍼 사용

## 반응형
- Mobile-first: 기본 모바일, `md:` 이상에서 데스크톱
- 사이드바: 모바일 오버레이, `md:` 이상 고정
- 높이: `h-dvh` 사용 (`h-screen` 아님 — 모바일 주소창 고려)

## 금지
- CSS Modules (`.module.css`)
- styled-components
- 인라인 `style` 속성
- `!important`
