# FAQ 상세 조회

백 진행상황: 시작 전
설명: 특정 FAQ의 상세 내용을 조회한다.
결정 논의사항: 후순위
API 그룹: FAQ
URL: /faqs/{faqId}
METHOD: GET
인증 필요: Yes
담당자: 상진 이
프론트 연결 상태: 시작 전

### 📥 요청(Request)

**Path Variable**

| 키 | 설명 |
| --- | --- |
| faqId | FAQ ID |

### 📤 응답(Response)

**성공 (200 OK)**

```json
{
  "faqId": string,
  "question": string,
  "answer": string,
  "topic": string,
  "createdAt": string
}
```

**실패 (401)** — UNAUTHORIZED

**실패 (404)** — FAQ_NOT_FOUND

**실패 (500)** — INTERNAL_SERVER_ERROR