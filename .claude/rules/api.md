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

## URL 경로 규칙 (필수)

- **백엔드 URL**: `/{domain}/{...}` (Spring Controller의 `@RequestMapping` 값)
- **프론트 실제 호출 경로**: `/api/backend/{domain}/{...}` (Next.js rewrites)
- **원칙**: 항상 `apiClient` 또는 `lib/api/services/*.ts`의 서비스 함수를 통해 호출한다. URL을 수동으로 조립하지 않는다.
- 직접 `fetch`가 필요한 예외(SSE 등)도 `/api/backend/*` prefix 또는 `NEXT_PUBLIC_API_BASE_URL`을 사용한다.

### 자주 틀리는 패턴

- ❌ `fetch('/api/documents/123')` — Next.js API route로 해석되어 404
- ❌ `fetch('/documents/123')` — 백엔드에 도달하지 않음
- ✅ `apiClient.get('/documents/123')` → 실제 요청은 `/api/backend/documents/123`
- ✅ 파일 URL 등 "백엔드가 내려주는 URL"은 **응답 DTO의 필드값(`fileUrl` 등)을 그대로 사용**. 프론트가 경로를 조합하지 않는다.

## API 기능 구현 전 체크리스트 (필수)

새로운 API를 호출하는 기능을 구현하기 전에 **반드시 아래 4단계를 순서대로** 수행한다.

1. **노션 원본 명세 확인** — `.claude/docs/api-info/*.md`에서 해당 기능 문서 열기 (예: "문서 상세 조회 *.md")
2. **요약 명세 확인** — `.claude/docs/api-{도메인}.md`에서 엔드포인트/응답 필드 대조
3. **백엔드 실제 구현 확인** — `d:/GIthub/kdd-api` 의 Controller/DTO를 직접 열어 `@RequestMapping`, `@RequestParam`, record 필드명을 확인
4. **실제 응답 1회 호출** — Swagger UI(`http://localhost:8000/swagger-ui`) 또는 curl로 샘플 응답을 확인하고, 필드 존재/값 형태를 눈으로 본다

위 4단계를 생략하고 "명세서에 있었던 것 같아서" 구현하는 것이 지금까지 반복된 사고의 공통 원인이다.

## 백엔드 DTO 크로스 검증 (필수)

- 프론트 타입을 작성/수정할 때 **반드시 백엔드 DTO(d:/GIthub/kdd-api)와 대조**한다
- 명세서(.claude/docs/api-*.md)만 보지 말고, 실제 Java record/class의 필드명·타입·nullable 여부를 확인한다
- 특히 주의할 불일치 패턴:
  - `Long`(Java) → `number`(TS), `String`(Java) → `string`(TS) — **`string`과 `number` 혼동 금지**
  - 백엔드 파라미터명(`size`)과 프론트 파라미터명(`pageSize`)이 다를 수 있다 — Controller의 `@RequestParam` 확인
  - 백엔드 non-nullable 필드를 프론트에서 optional(`?`)로 정의하지 않는다
  - 백엔드 DTO에 없는 필드를 프론트 타입에 추가하지 않는다 (UI 전용 필드는 별도 타입으로 분리)

## Spring Security 내부 값과 API 응답값 혼동 금지
- Spring Security의 `hasRole("ADMIN")`은 내부적으로 `ROLE_ADMIN` authority와 비교하지만, 이는 **권한 체크용 내부 prefix**일 뿐 실제 API 응답 값이 아니다
- API 응답의 `role` 필드는 DTO의 `getRole().getValue()` 결과(enum `value` 속성)를 그대로 따른다
  - 예: `Role.USER("user")`, `Role.ADMIN("admin")` → 응답은 `"user"` / `"admin"`
- 프론트에서 role 비교 시 **`"ROLE_USER"` / `"ROLE_ADMIN"`이 아니라 enum의 `value`(소문자 리터럴)와 비교**한다
- 백엔드 DTO의 `from()` 팩토리 메서드와 enum `value` 필드를 반드시 함께 확인한다

## 실제 API 응답으로 검증 (필수)
- 명세서와 백엔드 DTO 구조가 일치하더라도, **실제 응답 값**(enum의 직렬화 결과, null 여부 등)을 직접 확인한다
- 관리자/권한 분기 로직 등 구현 후 바로 UI 테스트가 어려운 경로는 **Swagger UI(`/swagger-ui`) 또는 curl로 응답 샘플**을 확인하고 구현한다
- "명세서 + 코드만 보고" 구현한 값은 런타임 직렬화 규칙을 놓쳐 한참 뒤 문제가 드러날 수 있다

## 쿠키 경로(Path) 스코핑
- 백엔드가 `Set-Cookie: Path=/auth`로 쿠키를 설정하면, 브라우저는 **요청 URL 경로가 `/auth`로 시작할 때만** 해당 쿠키를 전송한다
- `/api/backend/auth/*`로 프록시하면 쿠키가 전송되지 않는다 — 경로가 `/api/backend/...`이므로
- **해결**: 쿠키 Path와 일치하는 경로로 직접 rewrite 설정 (예: `/auth/refresh` → backend)

## SSE/스트리밍은 프록시를 거치지 않는다
- Next.js rewrites는 HTTP 응답을 버퍼링할 수 있어 SSE 실시간 스트리밍이 깨진다
- SSE 요청은 `NEXT_PUBLIC_API_BASE_URL`로 백엔드에 직접 fetch한다
- `apiClient`를 사용하지 않고 직접 fetch + Authorization 헤더 주입

## API 에러 응답 처리 (필수)
- 모든 API 호출의 catch 블록에서 `ApiError`를 확인하고 `ERROR_MESSAGES`로 사용자에게 표시한다
- 에러를 무시하는 빈 catch(`catch {}`, `catch { // TODO }`)는 금지
- 에러 표시 위치: 해당 UI 컴포넌트에 에러 상태(state) + 조건부 렌더링

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
