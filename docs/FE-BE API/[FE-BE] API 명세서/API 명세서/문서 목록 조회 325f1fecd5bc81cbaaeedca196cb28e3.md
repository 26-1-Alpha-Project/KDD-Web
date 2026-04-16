# 문서 목록 조회

백 진행상황: 진행 중
설명: [문서 목록 조회 탭에서 사용]
문서 목록 조회 탭에서 등록된 문서 목록을 조회한다.
카테고리 필터, 제목 검색, 정렬, 페이지네이션을 지원한다.
결정 논의사항:  
API 그룹: Documents
URL: /documents
METHOD: GET
인증 필요: Yes
기능명세서: 문서 검색 (https://www.notion.so/31af1fecd5bc8073b1fbcecc1a0a5fc7?pvs=21)
담당자: 상진 이
프론트 연결 상태: 시작 전
API 명세서 업데이트: 2026년 4월 13일

### 📥 요청(Request)

**Query Variable**

| 키 | 설명 |
| --- | --- |
| categoryId | 카테고리 필터 (선택) |
| keyword | 제목 검색 키워드 (선택) |
| sort | latest / popular (기본: latest) |
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
실패 (400) — INVALID_INPUT (page < 0, pageSize < 1, sort 값 오류)

{
  "error": "INVALID_INPUT",
  "message": "입력값이 올바르지 않습니다."
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