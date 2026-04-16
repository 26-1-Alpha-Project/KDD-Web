# 채팅 시작 전 추천 질문 조회(자주묻는질문 top5)

백 진행상황: 시작 전
설명: 사용자가 채팅을 시작하기 전에 자주 묻는 질문 목록을 조회한다.
결정 논의사항: 후순위
API 그룹: FAQ
URL: /chat/recommended-questions
METHOD: GET
인증 필요: Yes
기능명세서: 자주 묻는 질문 산출 (https://www.notion.so/31af1fecd5bc8038949fd36ee90c4ae7?pvs=21), 자주 묻는 질문 top5 보이기 (https://www.notion.so/top5-31af1fecd5bc80aabd4eeb2d72544f09?pvs=21)
담당자: 상진 이
프론트 연결 상태: 시작 전

### 📥 요청(Request)

> 별도 Request Body 없음
> 

### 📤 응답(Response)

**성공 (200 OK)**

```json
{
  "questions": [
    {
      "questionId": string,
      "content": string
    }
  ]
}
```

**실패 (401)** — UNAUTHORIZED

**실패 (500)** — INTERNAL_SERVER_ERROR

### 📜 상세 설명

- BE 스케줄러가 주기적으로 AI 서버(POST /api/faq/analyze)를 호출하여 산출한 **인기 질문 TOP 5**를 반환
- 채팅 시작 전 화면에 추천 질문 버튼으로 표시
- 이 TOP 5는 FAQ 후보 생성에도 동일하게 사용됨