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

## DOM 구조
- 스타일링만을 위한 불필요한 wrapper div를 만들지 않는다
- 클래스를 기존 요소에 직접 적용할 수 있으면 중첩 div 추가 금지
- 예: `<div className="sticky"><div className="mx-auto"><Input/></div></div>` → `<div className="sticky mx-auto"><Input/></div>`

## bg가 있는 요소의 spacing
- `bg-*`가 있는 요소에 `px-*`/`py-*`를 넣으면 배경색이 패딩 영역까지 확장된다
- 외부 여백이 필요하면 반드시 `margin`(`mx-*`, `my-*`) 또는 `w-[calc(100%-Nrem)]`을 사용한다
- `padding`은 요소 내부 콘텐츠 간격에만 사용한다
- 예: `bg-white px-4` (배경 확장됨) → `bg-white mx-auto w-[calc(100%-2rem)]` (배경은 콘텐츠만)

## 금지
- CSS Modules (`.module.css`)
- styled-components
- 인라인 `style` 속성
- `!important`
