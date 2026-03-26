---
globs: ["lib/api/**/*.ts", "types/api*.ts", "app/api/**/*.ts", "hooks/use*Query*.ts", "hooks/use*Mutation*.ts"]
---

# API 통신 규칙

## 타입 정의
- 요청/응답 타입은 반드시 `types/api.ts` (또는 `types/api/`)에 정의
- API 호출 코드에서 인라인 타입 정의 금지 — 항상 `types/`에서 import
- 타입을 새로 만들기 전에 `types/api.ts`에 이미 정의된 타입이 있는지 반드시 확인

## 타입 변경 금지 원칙
- 기존 요청/응답 타입의 필드를 삭제하거나 이름을 변경하지 않는다
- 필드 추가는 optional(`?`)로만 허용
- 타입 변경이 필요하면 사용자에게 먼저 확인

## API 호출 패턴
- API 호출 함수는 `lib/api/`에 도메인별로 분리
- fetch 래퍼나 axios 인스턴스 등 공통 유틸이 있으면 반드시 재사용
- 새로운 HTTP 클라이언트를 직접 만들지 않는다

## 예시 구조
```text
types/
  api.ts           또는 api/ 디렉토리
    chat.ts        채팅 관련 요청/응답 타입
    auth.ts        인증 관련 타입
lib/
  api/
    chat.ts        채팅 API 호출 함수
    client.ts      공통 fetch 래퍼
```
