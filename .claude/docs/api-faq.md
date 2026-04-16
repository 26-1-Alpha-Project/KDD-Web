# FAQ API 명세서

**백엔드 구현 상태**: 전체 시작 전 (후순위)
프론트 프록시 경로: `/api/backend/faqs/*`, `/api/backend/admin/faqs/*`
모든 엔드포인트 인증 필요

---

## 사용자 API

### GET /faqs — FAQ 목록 조회

#### 요청 (Query Parameters)
| 키 | 설명 |
|----|------|
| topic | 카테고리 필터 (선택) |
| page | 페이지 번호 (기본: 1) |
| pageSize | 페이지 크기 (기본: 10) |

#### 성공 응답 (200)
```json
{
  "data": [
    {
      "faqId": "string",
      "question": "string",
      "answer": "string",
      "topic": "string",
      "createdAt": "string"
    }
  ],
  "totalCount": 10,
  "page": 1,
  "pageSize": 10,
  "totalPages": 1
}
```

---

### GET /faqs/{faqId} — FAQ 상세 조회

#### 성공 응답 (200)
```json
{
  "faqId": "string",
  "question": "string",
  "answer": "string",
  "topic": "string",
  "createdAt": "string"
}
```

---

### GET /faqs/topics — FAQ 토픽 조회

#### 성공 응답 (200)
```json
{
  "topics": [
    { "topic": "academic", "label": "학사" }
  ]
}
```

토픽 값: academic, graduation, enrollment_status, scholarship, registration, curriculum, career, event

---

### POST /faqs/{faqId}/chat — FAQ 기반 채팅 시작

#### 성공 응답 (201)
```json
{
  "sessionId": "string",
  "messages": [
    { "messageId": "string", "role": "user", "content": "string", "createdAt": "string" },
    { "messageId": "string", "role": "assistant", "content": "string", "sources": [], "confidence": null, "createdAt": "string" }
  ]
}
```

---

## 관리자 API

### GET /admin/faqs/candidates — FAQ 후보 목록 조회

#### 요청
| 키 | 설명 |
|----|------|
| page | 기본: 1 |
| pageSize | 기본: 10 |

#### 성공 응답 (200)
```json
{
  "data": [
    {
      "candidateId": "string",
      "question": "string",
      "draftAnswer": "string",
      "frequency": 15,
      "topic": "string",
      "createdAt": "string"
    }
  ],
  "totalCount": 10,
  "page": 1,
  "pageSize": 10,
  "totalPages": 1
}
```

### POST /admin/faqs/candidates/{candidateId}/approve — FAQ 후보 승인

#### 성공 응답 (201)
```json
{
  "faqId": "string",
  "question": "string",
  "answer": "string",
  "topic": "string",
  "createdAt": "string"
}
```

### PATCH /admin/faqs/candidates/{candidateId}/reject — FAQ 후보 반려

#### 성공 응답 (200)
```json
{ "message": "FAQ 후보가 반려되었습니다." }
```

### POST /admin/faqs — FAQ 수동 등록

#### 요청
```json
{
  "question": "string",
  "answer": "string",
  "topic": "academic" | "graduation" | "enrollment_status" | "scholarship" | "registration" | "curriculum" | "career" | "event"
}
```

### PATCH /admin/faqs/{faqId} — FAQ 수정

변경할 필드만 포함.

### DELETE /admin/faqs/{faqId} — FAQ 삭제

#### 성공 응답 (200)
```json
{ "message": "FAQ가 삭제되었습니다." }
```

---

## GET /admin/statistics — 통계 조회 (Admin)

#### 성공 응답 (200)
```json
{
  "users": {
    "totalUsers": 100,
    "byUserType": { "student": 80, "staff": 20 },
    "byDepartment": { "software": 50, "ai": 30 },
    "byGrade": { "1": 20, "2": 25, "3": 20, "4": 15, "5_or_above": 0 }
  },
  "overview": {
    "totalQuestions": 500,
    "totalDocuments": 50,
    "totalSessions": 200,
    "totalUsers": 100
  },
  "categories": [
    { "category": "학사규정", "questionCount": 150, "percentage": 30 }
  ]
}
```
