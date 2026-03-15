// (admin) 그룹 레이아웃 — 관리자 전용 쉘
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* TODO: Admin Sidebar / TopNav */}
      <main>{children}</main>
    </div>
  );
}
