# FAQ 수동 등록

백 진행상황: 시작 전
설명: 관리자가 FAQ를 직접 등록한다.
결정 논의사항: 후순위
API 그룹: Admin
URL: /admin/faqs
METHOD: POST
인증 필요: Yes
기능명세서: (등록된) FAQ 관리 (https://www.notion.so/FAQ-31af1fecd5bc80de8620c5d0493444fd?pvs=21)
담당자: 상진 이
프론트 연결 상태: 시작 전

### 📥 요청(Request)

**Request Body (JSON)**

```json
{
  "question": string,
  "answer": string,
  "topic": "academic" | "graduation" | "enrollment_status" | "scholarship" | "registration" | "curriculum" | "career" | "event",
}
```

### 📤 응답(Response)

**성공 (201 Created)**

```json
{
  "faqId": string,
  "question": string,
  "answer": string,
  "topic": string,
  "createdAt": string
}
```

**실패 (400)** — INVALID_INPUT

**실패 (401)** — UNAUTHORIZED

**실패 (403)** — FORBIDDEN

**실패 (500)** — INTERNAL_SERVER_ERROR