import { Sidebar } from "@/components/sidebar/Sidebar";

// (main) 그룹 레이아웃 — 사이드바가 포함된 공통 쉘
// TODO: <TourProvider> 감싸기
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh bg-white">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
