# FAQ 후보 반려

백 진행상황: 시작 전
설명: FAQ 후보를 반려시킨다.
결정 논의사항: 후순위
API 그룹: Admin
URL: /admin/faqs/candidates/{candidateId}/reject
METHOD: PATCH
인증 필요: Yes
기능명세서: FAQ 후보 관리 (https://www.notion.so/FAQ-328f1fecd5bc80efb6dfeb4165ee3083?pvs=21)
담당자: 상진 이
프론트 연결 상태: 시작 전

### 📥 요청(Request)

**Path Variable**

| 키 | 설명 |
| --- | --- |
| candidateId | FAQ 후보 ID |

### 📤 응답(Response)

**성공 (200 OK)**

```json
{
  "message": "FAQ 후보가 반려되었습니다."
}
```

**실패 (401)** — UNAUTHORIZED

**실패 (403)** — FORBIDDEN

**실패 (404)** — CANDIDATE_NOT_FOUND

**실패 (500)** — INTERNAL_SERVER_ERROR