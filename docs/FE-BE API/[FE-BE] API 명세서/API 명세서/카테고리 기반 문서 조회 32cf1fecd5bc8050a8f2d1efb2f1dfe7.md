# 카테고리 기반 문서 조회

백 진행상황: 완료
설명: [트리 탐색 탭에서 사용]
카테고리 트리 탐색 탭에서 선택한 하위 카테고리에 속한 문서 목록을 조회한다.
하위 카테고리로만 조회 가능하며, 상위 카테고리로 요청 시 에러를 반환 및  검색 기능은 제공하지 않음
API 그룹: Documents
URL: /documents/by-category
METHOD: GET
인증 필요: Yes
기능명세서: 문서 목록 조회 (https://www.notion.so/319f1fecd5bc811595f0fa29d7cd190c?pvs=21)
담당자: 상진 이
프론트 연결 상태: 시작 전
API 명세서 업데이트: 2026년 4월 12일

### 📥 요청(Request)

**Query Variable**

| 키 | 설명 |
| --- | --- |
| categoryId | 카테고리 ID |
| page | 페이지 번호 (기본: 0) |
| pageSize | 페이지 크기 (기본: 20) |

### 📤 응답(Response)

**성공 (200 OK)**

```json
{
  "data": [
    {
      "documentId": number,
      "title": string,
      "category": string,
      "createdAt": string,
      "updatedAt": string
    }
  ],
  "totalCount": number,
  "page": number,
  "pageSize": number,
  "totalPages": number
}
```

```json
실패 (400) — INVALID_INPUT (page < 0 또는 pageSize < 1)

{
  "error": "INVALID_INPUT",
  "message": "입력값이 올바르지 않습니다."
}

실패 (400) — PARENT_CATEGORY_NOT_ALLOWED (상위 카테고리로 조회 시도)

{
  "error": "PARENT_CATEGORY_NOT_ALLOWED",
  "message": "하위 카테고리로만 문서를 조회할 수 있습니다."
}

실패 (401) — UNAUTHORIZED

{
  "error": "UNAUTHORIZED",
  "message": "인증이 필요합니다."
}

실패 (404) — CATEGORY_NOT_FOUND (존재하지 않는 카테고리)

{
  "error": "CATEGORY_NOT_FOUND",
  "message": "존재하지 않는 카테고리입니다."
}

실패 (500) — INTERNAL_SERVER_ERROR

{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "서버 내부 오류가 발생했습니다."
}
```