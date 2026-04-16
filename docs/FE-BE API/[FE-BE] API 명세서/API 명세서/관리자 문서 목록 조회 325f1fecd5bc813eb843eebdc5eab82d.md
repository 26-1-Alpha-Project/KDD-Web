# 관리자 문서 목록 조회

백 진행상황: 완료
설명: 관리자가 문서 목록을 조회한다.
API 그룹: Admin
URL: /admin/documents
METHOD: GET
인증 필요: Yes
기능명세서: 문서 관리 (https://www.notion.so/31af1fecd5bc80f4af30ed8986c9b866?pvs=21)
담당자: 상진 이
프론트 연결 상태: 시작 전
API 명세서 업데이트: 2026년 4월 7일

### 📥 요청(Request)

**Query Variable**

| 키 | 설명 |
| --- | --- |
| page | 페이지 번호 (기본: 0 |
| pageSize | 페이지 크기 (기본: 20) |

### 📤 응답(Response)

**성공 (200 OK)**

```json
{
  "data": [
    {
      "id": number,
      "title": string,
      "categoryId": number,
      "categoryName": string,
      "status": "uploaded" | "processing" | "completed" | "failed" | "reprocessing",
      "source": "SW" | "KMU",
      "createdAt": string
    }
  ],
  "totalCount": number,
  "page": number,
  "pageSize": number,
  "totalPages": number
}
```

**실패 (400)** — INVALID_INPUT (page < 0 또는 size < 1)

```json
{
  "error": "INVALID_INPUT",
  "message": "입력값이 올바르지 않습니다."
}
```

**실패 (401)** — UNAUTHORIZED

```json
{
  "error": "UNAUTHORIZED",
  "message": "인증이 필요합니다."
}
```

**실패 (403)** — FORBIDDEN

```json
{
  "error": "FORBIDDEN",
  "message": "관리자 권한이 필요합니다."
}
```

**실패 (500)** — INTERNAL_SERVER_ERROR

```json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "서버 내부 오류가 발생했습니다."
}
```