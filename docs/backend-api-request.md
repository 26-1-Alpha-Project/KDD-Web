# 백엔드 API 수정 요청

> 프론트엔드에서 API 명세와 대조 후 정리한 수정/추가 요청 사항입니다.
> 프론트는 이름 차이(필드명)는 이미 API 명세 기준으로 맞춰두었습니다.

---

## 1. FAQ 목록 조회 — 응답 필드 추가 요청

**API**: `GET /faqs`
**현재 응답 필드**: `faqId`, `question`, `answer`, `topic`, `createdAt`

### 추가 필요 필드

| 필드 | 타입 | 설명 | 이유 |
|------|------|------|------|
| `helpful` | `number` | 도움이 됨 카운트 | FAQ 목록에서 인기순 정렬 + 피드백 수 표시에 사용 |
| `notHelpful` | `number` | 도움이 안 됨 카운트 | 피드백 수 표시에 사용 |
| `sources` | `SourceRef[]?` | 답변 참고 문서 목록 | FAQ 답변 하단에 출처 문서+페이지 표시 (채팅 답변과 동일한 UX) |

`sources`의 각 항목 구조 (기존 채팅 SSE meta와 동일):
```json
{
  "documentId": string,
  "documentTitle": string,
  "page": number
}
```

### 요청 응답 예시

```json
{
  "data": [
    {
      "faqId": "1",
      "question": "성적우수 장학금 기준은?",
      "answer": "직전 학기 12학점 이상...",
      "topic": "scholarship",
      "createdAt": "2026-04-08T09:00:00Z",
      "helpful": 57,
      "notHelpful": 3,
      "sources": [
        { "documentId": "4", "documentTitle": "장학금 안내", "page": 2 }
      ]
    }
  ],
  "totalCount": 21,
  "page": 1,
  "pageSize": 10,
  "totalPages": 3
}
```

---

## 2. FAQ 후보 목록 조회 — 상태 필드 추가 요청

**API**: `GET /admin/faqs/candidates`
**현재 응답 필드**: `candidateId`, `question`, `draftAnswer`, `frequency`, `topic`, `createdAt`

### 추가 필요 필드

| 필드 | 타입 | 설명 | 이유 |
|------|------|------|------|
| `status` | `"pending" \| "approved" \| "rejected" \| "registered"` | 후보 처리 상태 | 관리자 화면에서 상태별 필터링 + 뱃지 표시에 사용 |

관리자가 승인/반려한 후보도 목록에 남아야 하고, 상태 필터링이 필요합니다.
현재 명세에는 상태 필드가 없어서, 목록에서 이미 처리된 항목과 대기 중인 항목을 구분할 수 없습니다.

### 대안

만약 `status` 필드 추가가 어렵다면, Query Parameter로 상태 필터를 지원해주세요:
```
GET /admin/faqs/candidates?status=pending
```

---

## 3. FAQ 후보 승인 — 요청 body에 topic 추가

**API**: `POST /admin/faqs/candidates/{candidateId}/approve`
**현재 요청**: body 없음

### 수정 요청

관리자가 후보를 승인할 때 카테고리(topic)를 지정해야 합니다.
현재 명세에서는 body가 없어서 topic을 전달할 방법이 없습니다.

```json
// Request Body (추가)
{
  "topic": "academic"
}
```

> 후보의 기존 `topic` 값을 기본값으로 사용하되, 관리자가 변경 가능하도록 해주세요.

---

## 4. 통계 조회 — 응답 구조 확인 요청

**API**: `GET /admin/statistics`

현재 명세(TBD)에서 `byUserType`, `byDepartment`, `byGrade`가 **key-value 객체** 형태입니다:

```json
"byUserType": { "student": 10278, "staff": 2569 }
```

프론트에서는 이를 **배열** 형태로 사용하고 있습니다:

```json
"byUserType": [
  { "type": "student", "count": 10278 },
  { "type": "staff", "count": 2569 }
]
```

어느 쪽으로 확정할지 결정이 필요합니다. 프론트는 어느 쪽이든 대응 가능하니, 백엔드 구현에 편한 쪽으로 결정해주세요.

---

## 5. FAQ 피드백 API — 신규 추가 요청

FAQ 답변에 대한 "도움이 됨/안 됨" 피드백을 전송하는 API가 명세에 없습니다.

### 제안 API

```
POST /faqs/{faqId}/feedback
```

**Request Body**:
```json
{
  "type": "helpful" | "not_helpful"
}
```

**Response (200 OK)**:
```json
{
  "helpful": number,
  "notHelpful": number
}
```

> 이 API가 없으면 FAQ의 `helpful`/`notHelpful` 카운트를 업데이트할 수 없습니다.

---

## 6. 문서 카테고리 트리 — documentCount 필드 추가 요청

**API**: `GET /documents/categories`

### 추가 필요 필드

| 필드 | 타입 | 설명 | 이유 |
|------|------|------|------|
| `documentCount` | `number` | 해당 카테고리의 문서 수 | 자료 페이지 트리 탐색에서 카테고리별 문서 수 표시에 사용 |

```json
{
  "categories": [
    {
      "categoryId": "1",
      "name": "SW 학사공지",
      "documentCount": 4,
      "children": []
    }
  ]
}
```

---

## 요약

| # | API | 요청 유형 | 우선순위 |
|---|-----|----------|---------|
| 1 | `GET /faqs` | 응답에 `helpful`, `notHelpful`, `sources` 추가 | P0 |
| 2 | `GET /admin/faqs/candidates` | 응답에 `status` 추가 | P1 |
| 3 | `POST .../approve` | 요청 body에 `topic` 추가 | P1 |
| 4 | `GET /admin/statistics` | `byUserType` 등 구조 확정 | P2 |
| 5 | `POST /faqs/{faqId}/feedback` | 신규 API | P1 |
| 6 | `GET /documents/categories` | `documentCount` 추가 | P2 |

---

## 프론트에서 이미 맞춘 사항 (참고용)

프론트 타입을 API 명세 기준으로 수정 완료한 항목입니다. 백엔드 수정 불필요.

| 항목 | 변경 내용 |
|------|----------|
| `FAQTopic` | `topicId` → `topic`, `name` → `label`, `count` 제거 |
| `RecommendedQuestion` | `question` → `content`, `topic` 제거 |
| `ChatSession` | `updatedAt` → `lastMessageAt` |
| `PopularDocument` | `score` → `viewCount`/`referenceCount`/`popularityScore` |
| `FAQCandidate` | `topic`을 필수로 변경 (API 명세 일치) |
| FAQ topic 값 | 한국어("학사") → 영문 enum("academic") 전환 완료 |
