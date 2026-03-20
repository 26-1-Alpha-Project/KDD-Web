"use client";

// 투어 단계 wrapper — 각 단계 타깃 엘리먼트를 감싸는 컴포넌트
// TODO: ref를 TourProvider에 등록하여 spotlight 위치 계산에 활용
export default function TourStep({
  children,
  stepId,
}: {
  children: React.ReactNode;
  stepId: string;
}) {
  return <>{children}</>;
}
