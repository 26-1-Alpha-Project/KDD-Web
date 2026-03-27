"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { SidebarContext } from "@/components/sidebar/SidebarContext";
import { ChatProvider } from "@/components/chat/ChatContext";

// TODO: <TourProvider> 감싸기
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SidebarContext.Provider
      value={{ open: sidebarOpen, setOpen: setSidebarOpen }}
    >
      <ChatProvider>
        <div className="flex h-dvh bg-white">
          <Sidebar />
          <main className="flex min-w-0 h-dvh flex-1 flex-col">{children}</main>
        </div>
      </ChatProvider>
    </SidebarContext.Provider>
  );
}
