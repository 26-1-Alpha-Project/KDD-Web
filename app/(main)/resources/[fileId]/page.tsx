// 자료 상세 페이지 — PDF 뷰어
// 유저플로우: /resources (폴더 트리) → 파일 선택 → PDF 뷰어
export default function ResourceFilePage({
  params,
}: {
  params: { fileId: string };
}) {
  return (
    <div>
      <h1>자료 뷰어</h1>
      {/* TODO: PDF 뷰어 — fileId: {params.fileId} */}
    </div>
  );
}
