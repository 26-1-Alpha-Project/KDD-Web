# Documents API 명세서

## 사용자 API (백엔드 prefix: `/documents`)

프론트 프록시 경로: `/api/backend/documents/*`
모든 엔드포인트 인증 필요: `Authorization: Bearer <accessToken>`

---

### GET /documents/categories — 카테고리 트리 조회

**백엔드 구현 상태**: 완료

#### 성공 응답 (200)
```json
{
  "categories": [
    {
      "categoryId": 1,
      "name": "학사규정",
      "children": [
        { "categoryId": 11, "name": "수강신청", "children": [] },
        { "categoryId": 12, "name": "휴학·복학", "children": [] }
      ]
    }
  ]
}
```

#### 에러: 401 UNAUTHORIZED, 500 INTERNAL_SERVER_ERROR

---

### GET /documents/by-category — 카테고리 기반 문서 조회

**백엔드 구현 상태**: 완료

#### 요청 (Query Parameters)
| 키 | 필수 | 설명 |
|----|------|------|
| categoryId | O | 하위 카테고리 ID (상위 카테고리 불가) |
| page | X | 기본: 0 |
| pageSize | X | 기본: 20 |

#### 성공 응답 (200)
```json
{
  "data": [
    {
      "documentId": 1,
      "title": "string",
      "category": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "totalCount": 10,
  "page": 0,
  "pageSize": 20,
  "totalPages": 1
}
```

#### 에러
| 코드 | error | message |
|------|-------|---------|
| 400 | INVALID_INPUT | 입력값이 올바르지 않습니다. |
| 400 | PARENT_CATEGORY_NOT_ALLOWED | 하위 카테고리로만 문서를 조회할 수 있습니다. |
| 401 | UNAUTHORIZED | 인증이 필요합니다. |
| 404 | CATEGORY_NOT_FOUND | 존재하지 않는 카테고리입니다. |
| 500 | INTERNAL_SERVER_ERROR | 서버 내부 오류가 발생했습니다. |

---

### GET /documents — 문서 목록 조회

**백엔드 구현 상태**: 진행 중 (DocumentController에 아직 없음)

#### 요청 (Query Parameters)
| 키 | 필수 | 설명 |
|----|------|------|
| categoryId | X | 카테고리 필터 |
| keyword | X | 제목 검색 키워드 |
| sort | X | latest / popular (기본: latest) |
| page | X | 기본: 0 |
| pageSize | X | 기본: 20 |

#### 성공 응답 (200)
```json
{
  "data": [
    {
      "documentId": 1,
      "title": "string",
      "category": "string",
      "updatedAt": "string"
    }
  ],
  "totalCount": 10,
  "page": 0,
  "pageSize": 20,
  "totalPages": 1
}
```

---

### GET /documents/{documentId} — 문서 상세 조회

**백엔드 구현 상태**: 진행 중 (DocumentController에 아직 없음)

#### 성공 응답 (200) — 명세서 기준
```json
{
  "documentId": 1,
  "title": "string",
  "category": "string",
  "fileUrl": "string",
  "viewCount": 100,
  "updatedAt": "string",
  "createdAt": "string"
}
```

#### 에러: 401 UNAUTHORIZED, 404 DOCUMENT_NOT_FOUND, 500 INTERNAL_SERVER_ERROR

---

### GET /documents/popular — 인기 문서 조회

**백엔드 구현 상태**: 진행 중

#### 성공 응답 (200)
```json
{
  "documents": [
    {
      "documentId": 1,
      "title": "string",
      "category": "string",
      "viewCount": 100,
      "referenceCount": 50,
      "popularityScore": 250,
      "updatedAt": "string"
    }
  ]
}
```

---

## 관리자 API (백엔드 prefix: `/admin/documents`)

프론트 프록시 경로: `/api/backend/admin/documents/*`

---

### GET /admin/documents — 관리자 문서 목록 조회

**백엔드 구현 상태**: 완료

#### 요청 (Query Parameters)
| 키 | 설명 |
|----|------|
| page | 기본: 0 |
| size | 기본: 20 (백엔드 파라미터명 주의: `size` not `pageSize`) |

#### 성공 응답 (200)
```json
{
  "data": [
    {
      "id": 1,
      "title": "string",
      "categoryId": 1,
      "categoryName": "string",
      "status": "uploaded" | "processing" | "completed" | "failed" | "reprocessing",
      "source": "SW" | "KMU",
      "createdAt": "string"
    }
  ],
  "totalCount": 10,
  "page": 0,
  "pageSize": 20,
  "totalPages": 1
}
```

---

### POST /admin/documents — 문서 업로드

**백엔드 구현 상태**: 완료
**Content-Type**: `multipart/form-data`

#### 요청
- `file`: PDF 파일 (MultipartFile)
- `data`: JSON (DocumentUploadRequest)
```json
{
  "title": "string",
  "categoryId": 1,
  "source": "SW" | "KMU"
}
```

#### 성공 응답 (201)
```json
{
  "id": 1,
  "title": "string",
  "categoryId": 1,
  "categoryName": "string",
  "status": "uploaded",
  "source": "SW",
  "originalFilename": "document.pdf",
  "fileSize": 102400,
  "createdAt": "string"
}
```

#### 에러: 400 INVALID_INPUT, 400 INVALID_FILE_TYPE, 401 UNAUTHORIZED, 403 FORBIDDEN, 404 CATEGORY_NOT_FOUND, 500 INTERNAL_SERVER_ERROR

---

### GET /admin/documents/{documentId}/status — 문서 처리 상태

**백엔드 구현 상태**: 완료

#### 성공 응답 (200)
```json
{
  "documentId": 1,
  "status": "uploaded" | "processing" | "completed" | "failed",
  "createdAt": "string"
}
```

---

### POST /admin/documents/{documentId}/reprocess — 문서 재처리

**백엔드 구현 상태**: 완료

#### 성공 응답 (200)
```json
{ "documentId": 1, "status": "reprocessing" }
```

#### 에러: 401, 403, 404 DOCUMENT_NOT_FOUND, 409 DOCUMENT_ALREADY_PROCESSING, 500

---

### PATCH /admin/documents/{documentId}/category — 카테고리 수정

**백엔드 구현 상태**: 완료

#### 요청
```json
{ "categoryId": 2 }
```

#### 성공 응답 (200)
DocumentDetailResponse 전체 (id, title, categoryId, categoryName, status, source, originalFilename, fileSize, createdAt)

---

### DELETE /admin/documents/{documentId} — 문서 삭제

**백엔드 구현 상태**: 완료

#### 성공 응답 (200)
```json
{ "message": "문서가 삭제되었습니다." }
```

---

## 백엔드 DTO

```java
record CategoryTreeResponse(Long categoryId, String name, List<CategoryTreeResponse> children) {}
record DocumentByCategoryResponse(Long documentId, String title, String category, LocalDateTime createdAt, LocalDateTime updatedAt) {}
record DocumentDetailResponse(Long id, String title, Long categoryId, String categoryName, String status, String source, String originalFilename, Long fileSize, LocalDateTime createdAt) {}
record DocumentListResponse(Long id, String title, Long categoryId, String categoryName, String status, String source, LocalDateTime createdAt) {}
record DocumentStatusResponse(Long documentId, String status, LocalDateTime createdAt) {}
record DocumentReprocessResponse(Long documentId, String status) {}
record DocumentUploadRequest { String title; Long categoryId; String source; }
record DocumentCategoryUpdateRequest { Long categoryId; }
```

## 명세서 vs 백엔드 차이점

1. **GET /documents, GET /documents/{documentId}, GET /documents/popular**: 백엔드 DocumentController에 아직 없음 (진행 중)
   - 프론트는 명세서 기준으로 타입 정의, 백엔드 구현 완료 시 연동
2. **관리자 문서 목록**: 백엔드 파라미터명이 `size` (not `pageSize`)
   - `@RequestParam(defaultValue = "20") int size`
3. **문서 상세 응답**: 명세서는 `documentId`, `category`, `fileUrl`, `viewCount`, `updatedAt` / 백엔드 DTO는 `id`, `categoryName`, `originalFilename`, `fileSize` — **구조 불일치**
   - 사용자용 상세 조회 (`/documents/{documentId}`)와 관리자용 상세 (`DocumentDetailResponse`)가 다를 수 있음
