---
name: new-component
description: 프로젝트 컨벤션에 맞는 새 컴포넌트를 생성한다. 컴포넌트 생성, 새 컴포넌트, 파일 만들기, 컴포넌트 추가 등을 언급할 때 반드시 사용.
argument-hint: "[경로/컴포넌트명 (예: chat/ChatMessage)]"
---

# 새 컴포넌트 생성

프로젝트 컨벤션에 맞는 새 컴포넌트 파일을 생성한다.

## 인자

- 컴포넌트 경로 (필수): `/new-component chat/ChatMessage`
- `chat/ChatMessage` → `components/chat/ChatMessage.tsx`

## 단계

1. 인자에서 디렉토리와 컴포넌트 이름 추출
2. 동일 디렉토리의 기존 컴포넌트 패턴 분석
3. 클라이언트 컴포넌트 여부를 사용자에게 확인
4. 다음 템플릿 기반으로 파일 생성:

### 서버 컴포넌트 (기본)

```tsx
interface ComponentNameProps {
  // props
}

export function ComponentName({}: ComponentNameProps) {
  return (
    <div>
    </div>
  );
}
```

### 클라이언트 컴포넌트

```tsx
"use client";

interface ComponentNameProps {
  // props
}

export function ComponentName({}: ComponentNameProps) {
  return (
    <div>
    </div>
  );
}
```

5. 필요 시 Props 인터페이스 구조를 사용자와 논의

## 참조

- 기존 패턴: `components/chat/ChatHeader.tsx`, `components/chat/ChatInput.tsx`
- Context 패턴: `components/sidebar/SidebarContext.tsx`
