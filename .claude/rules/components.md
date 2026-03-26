---
globs: ["components/**/*.tsx", "!components/ui/**"]
---

# 컴포넌트 작성 규칙

## 파일 구조
- 한 파일에 하나의 컴포넌트만 export
- 파일명: PascalCase (예: `ChatHeader.tsx`)
- 기능별 디렉토리 그룹핑 (예: `components/chat/`, `components/sidebar/`)

## 컴포넌트 선언
```tsx
interface ComponentNameProps {
  onSend?: (message: string) => void;
}

export function ComponentName({ onSend }: ComponentNameProps) {
  return <div>...</div>;
}
```
- function 선언 + named export (arrow function export 금지)
- Props 인터페이스는 컴포넌트 바로 위에 선언
- 콜백 prop: `on` 접두사 (onSend, onClick, onClose)

## 클라이언트 컴포넌트
- 서버 컴포넌트가 기본 — `"use client"`는 상태/이벤트/브라우저 API 사용 시에만
- `"use client"` 지시자는 파일 최상단에 선언

## 아이콘
- lucide-react에서 개별 임포트: `import { Menu } from "lucide-react"`
- 크기: `className="size-4"` 또는 `className="size-5"`

## 애니메이션
- `motion/react`에서 임포트 (`framer-motion` 아님)
- exit 애니메이션은 `AnimatePresence`로 래핑

## 기존 패턴 참조
- 기본 컴포넌트: `components/chat/ChatHeader.tsx`
- Props + 콜백: `components/chat/ChatInput.tsx`
- 변형(variants): `components/ui/button.tsx` (cva 패턴)
- Context: `components/sidebar/SidebarContext.tsx`
- 모달 애니메이션: `components/sidebar/SearchModal.tsx`
