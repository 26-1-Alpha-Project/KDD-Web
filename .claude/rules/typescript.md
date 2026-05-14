---
globs: ["**/*.ts", "**/*.tsx"]
---

# TypeScript 규칙

## 엄격 모드
- `strict: true` — 암시적 any 금지
- `any` 타입 사용 금지 → `unknown`, 제네릭, 구체 타입 사용
- 타입 단언(`as`) 최소화

## 타입 정의
- 객체 형태: `interface` 선호
- 유니언/교차: `type` 사용
- 타입 파일: `types/` 디렉토리에 도메인별 분리
- 상수 배열: `as const` + 인덱스 타입으로 추출

## 임포트
- 타입 전용: `import type { ... }` 사용
- 경로 별칭: `@/` 사용 (같은 디렉토리 내 파일만 상대 경로 허용)
- 배럴 파일(index.ts) 불필요 — 직접 파일 경로로 임포트

## React 타입
- HTML 속성 확장: `React.ComponentProps<"element">`
- 이벤트: `React.MouseEvent`, `React.KeyboardEvent` 등 구체 타입
- children: `React.ReactNode`

## 네이밍
- 인터페이스/타입: PascalCase
- 상수: UPPER_SNAKE_CASE
- 함수/변수: camelCase
- 컴포넌트: PascalCase
