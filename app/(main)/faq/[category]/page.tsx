// FAQ 카테고리별 페이지
// 유저플로우: FAQ → 학과 카테고리 탭 → 학과 선택 → 학과별 FAQ 목록
//            FAQ → 서비스 카테고리 탭 → 서비스별 FAQ 목록
// [category] 예시: "software", "ai", "service" 등
type Props = { params: Promise<{ category: string }> };

export default async function FaqCategoryPage({ params }: Props) {
  const { category } = await params;
  return (
    <div>
      <h1>FAQ — {category}</h1>
    </div>
  );
}
