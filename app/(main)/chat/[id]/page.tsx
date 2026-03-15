// 채팅 상세 페이지 — 기존 채팅 불러오기 (Streaming UI)
// 유저플로우: 사이드바 채팅 이력 선택 → 채팅 표시
// 기능:
//   - 메시지 스트리밍 표시
//   - 답변 신뢰도 배지 (🟢 확신, 🟡 조건부, 🔴 문의 필요)
//   - 출처 표시 (Grounding) — 자료 페이지 URL 제공
//   - 정보 부족 시 추가 정보 요청 UI
//   - 규정 한계 시 문의 방법 안내
//   - 유사 질문 추천 (질문 빈도 기반)
type Props = { params: Promise<{ id: string }> };

export default async function ChatDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <div>
      <h1>채팅 #{id}</h1>
    </div>
  );
}
