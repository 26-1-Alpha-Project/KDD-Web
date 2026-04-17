# Documents API 명세서

## 요청 경로 규칙 (반드시 준수)

- **백엔드 URL**: `/documents/{...}` (기준 경로, Spring Controller의 `@RequestMapping` 값)
- **프론트 프록시 경로**: `/api/backend/documents/{...}` (Next.js rewrites가 백엔드로 포워딩)
- **프론트 호출 방법**: `apiClient.get('/documents/{id}')` — apiClient의 baseUrl이 `/api/backend`로 이미 세팅되어 있음
- **직접 fetch를 쓰더라도** 경로는 `/api/backend/documents/{...}` 여야 함

### 흔한 실수

- ❌ `fetch('/api/documents/123')` — Next.js API route로 해석되어 404
- ❌ `fetch('/documents/123')` — Vercel에서 정적 자원으로 해석되어 404
- ✅ `apiClient.get('/documents/123')` — 자동으로 `/api/backend/documents/123` 호출
- ✅ PDF 뷰어 등에서 파일 URL이 필요하면 **백엔드 응답의 `fileUrl` 필드를 그대로 사용**. 프론트가 경로를 만들지 않는다.

---

## 사용자 API (백엔드 prefix: `/documents`)

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

**백엔드 구현 상태**: 완료 (`DocumentController.getDocumentDetail`, `DocumentDetailPublicResponse`)

#### 성공 응답 (200)
```json
{
  "documentId": 1,
  "title": "string",
  "category": "string",
  "fileUrl": "string",
  "viewCount": 100,
  "createdAt": "string",
  "updatedAt": "string"
}
```

- `fileUrl`: 백엔드 `Document.storageKey` 값을 그대로 반환. 프론트는 이 값을 PDF 뷰어/다운로드 링크에 그대로 사용해야 하며, 임의로 경로를 조합하지 않는다.

#### 에러: 401 UNAUTHORIZED, 404 DOCUMENT_NOT_FOUND, 500 INTERNAL_SERVER_ERROR

---

### GET /documents/popular — 인기 문서 조회

**백엔드 구현 상태**: 완료

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

1. **사용자용 상세 vs 관리자용 상세**: 응답 DTO가 다름
   - 사용자: `DocumentDetailPublicResponse` (`documentId`, `title`, `category`, `fileUrl`, `viewCount`, `createdAt`, `updatedAt`)
   - 관리자: `DocumentDetailResponse` (카테고리/파일/처리 상태 등 추가 필드)
2. **관리자 문서 목록 페이지네이션**: 백엔드 파라미터명이 `size` (일반 사용자 API의 `pageSize`와 다름)
   - `AdminDocumentController.getDocuments`: `@RequestParam(defaultValue = "20") int size`
   - 프론트 `admin.service.ts`에서 `pageSize` → `size` 매핑 수행
3. **`fileUrl` 사용 규칙**: 프론트는 백엔드가 반환한 `fileUrl`을 그대로 사용해야 하며, `/api/documents/{id}` 같은 경로를 임의 조합하지 않는다.
