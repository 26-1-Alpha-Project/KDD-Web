# API 연동 남은 작업 목록

배포 환경에서 백엔드와 실제 연동하면서 발견된 미완성/불일치 항목을 정리한다. 우선순위 순으로 처리한다.

## 🔴 P0 — 기능 미동작

### 1. PDF 뷰어 fileUrl 하드코딩

- **파일**: `app/(main)/chat/[id]/page.tsx:159`
- **증상**: 채팅 답변의 출처 문서를 클릭하면 `GET /api/documents/{id}` 404 발생
- **원인**:
  - 프론트 프록시 경로는 `/api/backend/documents/{id}`인데 `/api/documents/{id}`로 호출 (경로 규칙 위반)
  - 동시에, PDF 뷰어용 URL은 백엔드가 `DocumentDetailPublicResponse.fileUrl`로 내려줘야 하는데 프론트가 임의로 조립 중
- **조치**:
  1. `handleOpenPDF`에서 `getDocumentDetail(documentId)` 호출
  2. 응답의 `fileUrl`을 뷰어 `fileUrl`로 그대로 전달
  3. 명세서 준수 체크: 응답 DTO 필드명은 `documentId`, `title`, `category`, `fileUrl`, `viewCount`, `createdAt`, `updatedAt`
- **관련 코드**: `lib/api/services/document.service.ts:102` (`getDocumentDetail` 이미 존재)
- **명세**: `.claude/docs/api-documents.md#get-documentsdocumentid`, `.claude/docs/api-info/문서 상세 조회 *.md`

### 2. 리소스 상세 페이지 다운로드 비활성

- **파일**: `app/(main)/resources/[fileId]/page.tsx:28`
- **현재**: `const hasFile = false; // TODO`
- **조치**: 백엔드 `DocumentDetailPublicResponse.fileUrl`이 이미 내려오므로 `detail.fileUrl` 존재 여부로 버튼 활성화/링크 연결

## 🟡 P1 — 백엔드 구현 대기

### 3. FAQ 관련 API 미구현

- **영향 API**:
  - `GET /faqs`, `GET /faqs/{id}`
  - `GET /admin/faqs`, `GET /admin/faqs/candidates`
  - `POST /admin/faqs`, `PATCH /admin/faqs/{id}`, `DELETE /admin/faqs/{id}`
  - `POST /admin/faqs/candidates/{id}/approve`, `/reject`
- **백엔드 상태**: `com.kdd.faq` 패키지 및 컨트롤러 없음
- **프론트 코드**: `lib/api/services/faq.service.ts`, `lib/api/services/admin.service.ts` (FAQ 부분)
- **조치**:
  - 백엔드에서 FAQ 컨트롤러 구현
  - 또는 구현 전까지 FAQ 탭/페이지를 "준비 중" UI로 대체 (현재는 500/404 에러 표출)

### 4. 추천 질문 API 미구현

- **파일**: `lib/api/services/chat.service.ts:112` — `GET /chat/recommended-questions`
- **백엔드 상태**: 미구현
- **증상**: 채팅 진입 시 500 (정적 리소스 404로 처리됨)
- **조치**: 백엔드 구현 또는 프론트에서 호출 제거/조건부 처리

## 🟢 P2 — 명세 정리

### 5. 관리자 문서 목록 페이지네이션 파라미터 네이밍

- **파일**: `lib/api/services/admin.service.ts`
- **현재**: 프론트 `pageSize` → 백엔드 `size`로 변환 전송 중 (정상 동작)
- **이유**: `AdminDocumentController.getDocuments`는 `@RequestParam int size`. 일반 사용자 API(`pageSize`)와 달라 혼동 여지 있음
- **조치**: 백엔드/프론트 네이밍 통일 논의 (우선은 현재 변환 로직 유지)

## 재발 방지

`.claude/rules/api.md`에 추가된 규칙을 지킨다.

- **백엔드 DTO 크로스 검증 필수** — 명세서만 믿지 말고 실제 Java record 확인
- **실제 API 응답으로 검증 필수** — Swagger/curl로 배포 환경 응답 확인
- **Spring Security 내부 값과 응답값 혼동 금지**
- **요청 경로는 `apiClient`/서비스 경유** — 직접 `fetch` 시에도 `/api/backend/*` 또는 `NEXT_PUBLIC_API_BASE_URL` 사용

이번 사고들의 공통 원인은 **Mock 모드로만 개발해 실제 백엔드 경로/응답과 틀어진 걸 배포 전에 확인하지 못한 것**이다. 각 기능 구현 시 Mock뿐 아니라 **실제 백엔드 한 번 호출해 응답을 확인**하는 습관이 필요하다.
