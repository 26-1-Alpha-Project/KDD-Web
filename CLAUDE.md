# KDD-web

국민대학교 소프트웨어융합대학 학사규정 특화 RAG 기반 AI 에이전트 웹 프론트엔드.

## 기술 스택

- **Framework**: Next.js 16 (App Router, RSC), React 19
- **Styling**: Tailwind CSS 4 (`@import "tailwindcss"` 문법), shadcn/ui (new-york)
- **Language**: TypeScript (strict mode)
- **Animation**: motion (`motion/react`에서 임포트, framer-motion 아님)
- **Validation**: Zod v4
- **Icons**: lucide-react
- **Package Manager**: npm

## 명령어

```bash
npm run dev      # 개발 서버 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
```

## 디렉토리 구조

```text
app/(auth)/       인증 라우트 (로그인, 프로필 설정)
app/(main)/       메인 라우트 (chat, resources, faq, settings) — 사이드바 레이아웃
app/admin/        관리자 라우트
components/       기능별 컴포넌트 (chat/, sidebar/, profile/, tour/)
components/ui/    shadcn/ui 컴포넌트 — 직접 수정 금지, shadcn CLI로만 관리
constants/        상수, mock 데이터 (TODO: API 연동 시 제거)
hooks/            커스텀 훅
lib/              유틸리티 (utils.ts, validations/)
types/            TypeScript 타입 정의
```

경로 별칭: `@/*` = 프로젝트 루트

## 핵심 규칙

- 함수 컴포넌트 + named export (페이지만 default export)
- `"use client"`는 필요한 경우에만
- CSS는 Tailwind 유틸리티 클래스만, 조건부 클래스는 `cn()` 사용
- 변형 컴포넌트는 `cva` (class-variance-authority) 패턴
- 색상은 CSS 변수 사용 (`bg-primary`, `text-foreground` 등)
- `any` 타입 금지
- 한국어 UI 텍스트, 한국어 커밋 메시지

## 금지사항

- `components/ui/` 직접 수정 (shadcn CLI 전용)
- CSS Modules, styled-components, 인라인 style
- `framer-motion` 임포트 (`motion/react` 사용)
- 하드코딩 색상 (`bg-blue-500` 등 — CSS 변수 사용)

## Git 컨벤션

### 커밋 메시지

접두사: `feat:`, `fix:`, `refactor:`, `design:`, `style:`, `comment:`, `test:`, `chore:`, `init:`, `rename:`, `remove:`

```text
feat: 로그인 기능 추가
fix: 유저 데이터 페칭 오류 수정
```

Ruleset: `^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\([\w\p{Hangul}\-\.]+\))?(!)?: [\w\p{Hangul} ]+([\s\S]*)`

### 브랜치

- `feature/*` — 기능 개발 (develop에서 분기)
- `hotfix/*` — 긴급 수정 (main에서 분기, main + develop 반영)
- `chore/*`, `docs/*` — 설정/문서
- `release/*` — 배포 전 점검 (예: `release/v1-0-0`)
- 형식: `feature/FE-12-login-page`, `hotfix/BE-4-fix-null-pointer`

### PR

- develop 브랜치로 머지
- 조직 PR 템플릿 사용 (PR 유형, 관련 이슈, 작업 내용, 스크린샷, 체크리스트)

### MCP

- Figma, Notion 연결됨

## 피드백 학습

사용자가 코드를 수정하거나 접근 방식을 교정하면, 그 피드백을 memory에 기록하여 같은 실수를 반복하지 않는다. 특히:

- "이거 아니야", "그거 말고" 같은 교정 → 즉시 feedback memory 저장
- 기존 유틸/컴포넌트를 무시하고 새로 만든 경우 → 어떤 기존 코드를 사용했어야 했는지 기록
- API 타입을 임의로 변경한 경우 → 올바른 타입 구조 기록

세부 규칙은 `.claude/rules/` 참조.
