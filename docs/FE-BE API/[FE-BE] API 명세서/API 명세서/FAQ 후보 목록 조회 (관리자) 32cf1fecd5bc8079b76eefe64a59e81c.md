# FAQ 후보 목록 조회 (관리자)

백 진행상황: 시작 전
설명: FAQ 후보 목록을 조회한다.
결정 논의사항: 후순위
API 그룹: Admin
URL: /admin/faqs/candidates
METHOD: GET
인증 필요: Yes
기능명세서: FAQ 후보 관리 (https://www.notion.so/FAQ-328f1fecd5bc80efb6dfeb4165ee3083?pvs=21)
담당자: 상진 이
프론트 연결 상태: 시작 전

### 📥 요청(Request)

**Query Variable**

| 키 | 설명 |
| --- | --- |
| page | 페이지 번호 (기본: 1) |
| pageSize | 페이지 크기 (기본: 10) |

### 📤 응답(Response)

**성공 (200 OK)**

```json
{
  "data": [
    {
      "candidateId": string,
      "question": string,
      "draftAnswer": string,
      "frequency": number,
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

**실패 (403)** — FORBIDDEN

**실패 (500)** — INTERNAL_SERVER_ERROR

### 📜 상세 설명

- BE 스케줄러가 주기적으로 AI 서버(POST /api/faq/analyze)를 호출하여 인기 질문 TOP 5 산출
- TOP 5 중 **기존 FAQ와 중복되지 않는 새로운 질문만** 후보(candidate)로 DB에 저장
- 이미 FAQ로 등록된 질문은 후보로 생성하지 않음
- 관리자는 이 목록에서 승인(→ FAQ 등록) 또는 반려 처리
- 동일한 TOP 5 데이터가 사용자의 채팅 전 추천 질문(13번)에도 사용됨