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

## 금지 API
- `window.prompt`, `window.alert`, `window.confirm` 등 브라우저 네이티브 다이얼로그 사용 금지
- 사용자 입력이 필요하면 인라인 편집, 커스텀 모달, 또는 UI 컴포넌트로 구현

## React Strict Mode 대응
- `useEffect` 내 1회성 사이드이펙트(OAuth code 처리, API 호출 등)는 Strict Mode에서 2번 실행된다
- `useRef`는 Strict Mode 언마운트→재마운트 시 리셋되므로 중복 방지에 **사용 금지**
- 대신 `sessionStorage` 키로 중복 실행을 방지한다 (예: `oauth_code_handled_${code}`)

## 이미지 슬라이드/캐러셀
- 슬라이드 전환 시 `<Image src={slides[current]}>`처럼 src를 바꾸면 매번 새로 다운로드한다
- **모든 이미지를 한 번에 렌더링**하고 CSS `opacity-0/100` 전환으로 보이기/숨기기 처리
- 첫 번째 이미지에만 `priority` 설정

## 기존 패턴 참조
- 기본 컴포넌트: `components/chat/ChatHeader.tsx`
- Props + 콜백: `components/chat/ChatInput.tsx`
- 변형(variants): `components/ui/button.tsx` (cva 패턴)
- Context: `components/sidebar/SidebarContext.tsx`
- 모달 애니메이션: `components/sidebar/SearchModal.tsx`
