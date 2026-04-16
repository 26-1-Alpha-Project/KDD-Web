# FAQ 토픽 조회

백 진행상황: 시작 전
설명: FAQ 카테고리 목록을 조회한다.
결정 논의사항: 후순위
API 그룹: FAQ
URL: /faqs/topics
METHOD: GET
인증 필요: Yes
기능명세서: FAQ 카테고리 조회 (https://www.notion.so/FAQ-32df1fecd5bc8030a26aee94e0eb2e46?pvs=21)
담당자: 상진 이
프론트 연결 상태: 시작 전

### 📥 요청(Request)

> 별도 Request Body 없음
> 

### 📤 응답(Response)

**성공 (200 OK)**

```json
{
  "topics": [
    { "topic": string, "label": string },
	  ...
  ]
}
```

**실패 (401)** — UNAUTHORIZED

**실패 (500)** — INTERNAL_SERVER_ERROR