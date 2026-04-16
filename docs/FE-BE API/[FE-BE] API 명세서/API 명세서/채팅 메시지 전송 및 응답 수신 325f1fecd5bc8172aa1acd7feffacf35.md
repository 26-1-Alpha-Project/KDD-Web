# 채팅 메시지 전송 및 응답 수신

백 진행상황: 진행 중
설명: 사용자 메시지를 전송하면 AI 답변을 생성하여 함께 반환한다.
이때 답변에 대한 신뢰도, 출처 문서 정보, 추천 질문을 함께 제공한다.
결정 논의사항: MVP(중요)
API 그룹: Chat
URL: /chat/sessions/{sessionId}/messages
METHOD: POST
인증 필요: Yes
기능명세서: 채팅 대화 기능 (https://www.notion.so/319f1fecd5bc81d08c02c01905d4511c?pvs=21), 관련 질문 추천 (https://www.notion.so/31af1fecd5bc80478846f35f3e44d513?pvs=21), 출처 표기 및 링크 (https://www.notion.so/31af1fecd5bc80408ca8e9bb04bebca1?pvs=21), AI 답변 표시 (https://www.notion.so/AI-31af1fecd5bc801e91bcc0dd8cbd3126?pvs=21), 입력 상호작용 (https://www.notion.so/31af1fecd5bc809481c5ce3c0d9c5026?pvs=21), 멀티턴 대화 (https://www.notion.so/31af1fecd5bc80c78a8aef4839b83a8f?pvs=21), 신뢰도 표시 (https://www.notion.so/31af1fecd5bc806eb213d2f4a471e8fa?pvs=21), 파일 첨부 기능 (https://www.notion.so/31af1fecd5bc802d8658cb51ccfd8462?pvs=21), 답변 캐싱 (https://www.notion.so/320f1fecd5bc80338122fce365a14cfc?pvs=21), 세션당 채팅 제한 (https://www.notion.so/31af1fecd5bc80ed8fb7f83c6e0fc2e4?pvs=21)
담당자: 장민주
프론트 연결 상태: 시작 전
API 명세서 업데이트: 2026년 4월 13일

### 📥 요청(Request)

**Path Variable**

| 키 | 설명 |
| --- | --- |
| sessionId | 채팅 세션 ID |

**Request Body (JSON)**

```json
{
  "content": string
}
```

### 📤 응답(Response)

**성공 (200 OK) — SSE 스트리밍** `Content-Type: text/event-stream`

### SSE 타입 분기

**meta** — 첫 번째 청크, 메타데이터

```json
// 문서 검색 성공
data: {
   "type":"meta",
   "subtype":"document",
   "confidence":"high",
   "sources":[
      {
         "documentId": 123,
         "documentTitle":"2026_학사요람.pdf",
         "page":45
      }
   ]
}

// 캐시 적중
data: {
   "type":"meta",
   "subtype":"cache",
   "sources":[
      {
         "documentId": ...,
         "documentTitle":"...",
         "page":45
      }
   ]
}

// 잡담 판별
data: {
   "type":"meta",
   "subtype":"chitchat"
}
```

**fallback** — 문서 검색 실패 시, 추천 질문 반환 후 즉시 done

```json
data: {
   "type":"fallback",
   "message":"관련 학사규정을 찾지 못했습니다.",
   "suggestedQuestions":[
      "일반휴학 신청 기한이 언제인가요?",
      "복학 절차는 어떻게 되나요?"
   ]
}
```

**text** — 답변 텍스트 스트리밍

```json
data: {
   "type":"text",
   "content":"답변 텍스트 청크..."
}
```

**done** — 스트리밍 완료 신호

```json
data: {
   "type":"done",
   "messageId": 123
}
```

**error** — 스트리밍 중 오류

```json
data: {
   "type":"error",
   "message":"답변 생성 중 오류가 발생했습니다."
}
```

**실패 (400)** — INVALID_INPUT

**실패 (401)** — UNAUTHORIZED

**실패 (404)** — SESSION_NOT_FOUND

**실패 (429)** — RATE_LIMIT_EXCEEDED

```json
{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "채팅 횟수 제한을 초과했습니다.",
  "remaining": 0,
  "resetsAt": "2026-03-24T15:00:00Z"
}
```

**실패 (500)** — INTERNAL_SERVER_ERROR

**실패 (403)** — SESSION_FORBIDDEN

```json
{
  "error": "SESSION_FORBIDDEN",
  "message": "다른 사용자의 채팅 세션은 접근할 수 없습니다."
}
```

### 📜 상세 설명

- Backend가 AI 서버 SSE를 받아 프론트에 재전달 (프록시)
- Backend는 AI 응답의 snake_case/한국어 값을 camelCase/영문으로 변환하여 전달
- 스트리밍 완료 후 Backend가 AI 답변을 DB에 저장

**내부 흐름:**

```
1. BE: 세션 유효성 확인 + 사용자 메시지 DB 저장
2. BE: 사용자 프로필에서 user_context 조합
3. BE: DB에서 최근 N개 대화 history 추출
4. BE: AI 서버에 POST /api/chat 호출
5. AI: 캐시 탐색 → 잡담 판별 → 벡터 검색 → RAG → SSE 스트리밍
6. BE: AI SSE를 받으며 프론트에 재전달
7. BE: done 수신 후 AI 답변 DB 저장

※ FE가 SSE 연결을 중단해도 BE는 AI 답변을 끝까지 수신하여 DB에 저장한다.
   사용자는 재접속 후 히스토리 조회로 동일한 답변을 확인할 수 있다.
```

**BE → FE 변환 규칙:**
① confidence: AI가 영문 소문자로 반환 (변환 불필요)
② sources: AI의 doc_id → documentId, doc_name → documentTitle
③ 전체 필드 snake_case → camelCase 변환

- suggested_questions → suggestedQuestions

④ done 이벤트: AI는 usage(토큰)를 반환하지만, BE는 답변을
DB 저장 후 생성된 messageId를 FE에 전달