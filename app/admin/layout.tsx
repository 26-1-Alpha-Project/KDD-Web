// 관리자 전용 레이아웃 — role 체크
// TODO: middleware 또는 여기서 role === 'admin' 가드 처리
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
