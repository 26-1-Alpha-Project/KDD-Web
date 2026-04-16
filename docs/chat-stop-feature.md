# 채팅 중지 기능 요청사항 (BE/AI)

## 배경
사용자가 질문을 잘못 입력했을 때 "답변 생성 중지" 기능이 필요하다.
현재 백엔드는 프론트 연결이 끊겨도 AI 답변을 끝까지 수신하여 DB에 저장���는데,
���못된 질문+답변이 히스토리에 남으면 이후 AI 맥락 파악에 노이즈가 된다.

## 요청 사항

### 1. 취소 엔드포인트 추가
- `DELETE /chat/sessions/{sessionId}/messages/last`
- 마지막 턴(user 메시지 + assistant 응답) 삭��
- 스트리밍 ��에도 호출 가능해야 함

### 2. AI 스트림 중단
- 프론트 SSE 연결 끊김 감지 시 `dispose()` 호출하여 AI 서버 요청도 취소
- 현재 `clientConnected.set(false)`만 하고 구독은 유지하는데, 취소 시에는 구독 해제 필요

### 3. DB 저장 방지
- 취소된 턴은 DB에 저장하지 않��
- `clientConnected`가 `false`인 상태에서 `done` 수신 시 persist 건너뛰기

## 프론트 흐름 (참고)
```
중지 버튼 클릭 → SSE abort() → DELETE /chat/sessions/{id}/messages/last → UI 초기화
```
