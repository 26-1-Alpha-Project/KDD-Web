"use client";

import { Suspense, useState } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { SidebarContext } from "@/components/sidebar/SidebarContext";
import { ChatProvider } from "@/components/chat/ChatContext";
import { AuthProvider } from "@/components/providers/AuthProvider";

// TODO: <TourProvider> 감싸기
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <SidebarContext.Provider
        value={{ open: sidebarOpen, setOpen: setSidebarOpen }}
      >
        <ChatProvider>
          <div className="flex h-dvh bg-white">
            <Sidebar />
            <Suspense>
              <main className="flex min-w-0 flex-1 flex-col">{children}</main>
            </Suspense>
          </div>
        </ChatProvider>
      </SidebarContext.Provider>
    </AuthProvider>
  );
}
