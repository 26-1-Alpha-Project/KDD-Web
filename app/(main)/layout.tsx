// (main) 그룹 레이아웃 — 사이드바가 포함된 공통 쉘
// 사이드바 메뉴: 새 채팅, 자료, FAQ, 마이페이지, 설정, (관리자)
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* TODO: Sidebar */}
      <main>{children}</main>
    </div>
  );
}
