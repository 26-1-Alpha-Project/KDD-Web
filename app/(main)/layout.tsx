// (main) 그룹 레이아웃 — 사이드바가 포함된 공통 쉘
// 사이드바 메뉴: 새 채팅, 자료, FAQ, 설정, (관리자)
// TODO: <TourProvider> 감싸기
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // TODO: <TourProvider>
    <div>
      {/* TODO: Sidebar */}
      <main>{children}</main>
    </div>
    // TODO: </TourProvider>
  );
}
