# KDD - 국민대 학사 AI 비서

국민대학교 학사 규정 및 교칙 특화 **RAG(Retrieval-Augmented Generation) 기반 AI 에이전트** 웹 서비스입니다.

학사 규정, 요람, 학칙 등을 학습한 AI가 자연어 질문에 **정확한 출처와 함께** 답변합니다.

## 주요 기능

| 기능 | 설명 |
|------|------|
| 💬 자연어 질의응답 | 친구에게 묻듯이 학사 규정을 질문하세요 |
| 📎 근거 기반 답변 | 모든 답변에 출처(요람 페이지, 학칙 조항) 제공 |
| 🔄 멀티턴 대화 | 이전 대화 문맥을 유지한 연속 질문 지원 |
| 🛡️ 신뢰도 표시 | 높음/중간/낮음 신뢰도로 답변 품질 안내 |
| 🗂️ 관리자 대시보드 | 문서 업로드, FAQ 통계, 시스템 현황 확인 |

## 스크린샷

| 랜딩 페이지 | 채팅 인터페이스 |
|------------|---------------|
| ![Landing](https://github.com/user-attachments/assets/a27d0d10-cb11-4455-b07f-7bde23e9708f) | ![Chat](https://github.com/user-attachments/assets/2efaf601-5b51-45cf-917c-15c7bbc07380) |

| 관리자 대시보드 | 통계 |
|--------------|------|
| ![Admin Dashboard](https://github.com/user-attachments/assets/c3ff2edd-97b0-4ef0-9cd8-353234490d7e) | ![Statistics](https://github.com/user-attachments/assets/1f0251a0-8262-41af-a7eb-129a3b6e4cf1) |

## 기술 스택

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4
- **AI/RAG**: AWS Bedrock (Claude 3.5 Sonnet) / OpenAI API *(백엔드 연동 필요)*
- **Vector DB**: Pinecone / Chroma *(백엔드 연동 필요)*
- **Storage**: AWS S3 *(백엔드 연동 필요)*

## 페이지 구조

```
/                       랜딩 페이지
/chat                   채팅 인터페이스 (KakaoTalk 스타일)
/admin/login            관리자 로그인
/admin/dashboard        관리자 대시보드
/admin/documents        문서 관리 (업로드/삭제)
/admin/stats            질의응답 통계 및 FAQ 분석
```

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 3. 빌드

```bash
npm run build
npm start
```

## 관리자 로그인 (테스트용)

| 항목 | 값 |
|------|-----|
| 이메일 | `admin@kookmin.ac.kr` |
| 비밀번호 | `admin1234` |

> ⚠️ 테스트용 자격증명입니다. 프로덕션 배포 시 반드시 실제 인증 시스템으로 교체하세요.

## API 라우트

| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/chat` | POST | RAG 기반 질의응답 |
| `/api/auth` | POST | 관리자 인증 |
| `/api/admin/documents` | GET/POST/DELETE | 문서 관리 |

## 팀

국민대학교 소프트웨어융합대학 KDD 연구팀
