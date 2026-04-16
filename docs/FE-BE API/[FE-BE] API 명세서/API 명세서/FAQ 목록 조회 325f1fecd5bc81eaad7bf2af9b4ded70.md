# FAQ 목록 조회

백 진행상황: 시작 전
설명: 사용자가 FAQ 목록을 조회한다. 카테고리별 조회를 지원한다.
결정 논의사항: 후순위
API 그룹: FAQ
URL: /faqs
METHOD: GET
인증 필요: Yes
기능명세서: FAQ 목록 조회 (https://www.notion.so/FAQ-32cf1fecd5bc80dea19cffcbeafc8bb5?pvs=21)
담당자: 상진 이
프론트 연결 상태: 시작 전

### 📥 요청(Request)

**Query Variable**

| 키 | 설명 |
| --- | --- |
| topic | 카테고리 필터 (선택) |
| page | 페이지 번호 (기본: 1) |
| pageSize | 페이지 크기 (기본: 10) |

### 📤 응답(Response)

**성공 (200 OK)**

```json
{
  "data": [
    {
      "faqId": string,
      "question": string,
      "answer": string,
      "topic": string,
      "createdAt": string
    }
  ],
  "totalCount": number,
  "page": number,
  "pageSize": number,
  "totalPages": number
}
```

**실패 (401)** — UNAUTHORIZED

**실패 (500)** — INTERNAL_SERVER_ERROR