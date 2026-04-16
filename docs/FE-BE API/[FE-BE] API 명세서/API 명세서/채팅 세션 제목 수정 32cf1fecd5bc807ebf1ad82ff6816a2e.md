# 채팅 세션 제목 수정

백 진행상황: 완료
설명: 채팅 세션 제목을 수정한다.
API 그룹: Chat
URL: /chat/sessions/{sessionId}
METHOD: PATCH
인증 필요: Yes
기능명세서: 채팅 세션 제목 수정 (https://www.notion.so/32df1fecd5bc80ab96e0fa500edb1a03?pvs=21)
담당자: 장민주
프론트 연결 상태: 시작 전
API 명세서 업데이트: 2026년 4월 12일

### 📥 요청(Request)

**Path Variable**

| 키 | 설명 |
| --- | --- |
| sessionId | 채팅 세션 ID |

**Request Body (JSON)**

```json
{
  "title": string
}
```

### 📤 응답(Response)

**성공 (200 OK)**

```json
{
  "sessionId": number,
  "title": string
}
```

**실패 (400)** — INVALID_INPUT

**실패 (401)** — UNAUTHORIZED

**실패 (404)** — SESSION_NOT_FOUND

**실패 (500)** — INTERNAL_SERVER_ERROR

**실패 (403)** — SESSION_FORBIDDEN

```json
{
  "error": "SESSION_FORBIDDEN",
  "message": "다른 사용자의 채팅 세션은 접근할 수 없습니다."
}
```