"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "@/components/sidebar/SidebarContext";

export function ChatHeader() {
  const { setOpen } = useSidebar();

  return (
    <header className="flex h-14 shrink-0 items-center border-b border-black/5 px-4">
      <button
        onClick={() => setOpen(true)}
        className="mr-2 flex size-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-secondary md:hidden"
      >
        <Menu className="size-5" />
      </button>
      <h2 className="flex-1 text-lg font-semibold text-foreground md:text-left text-center">
        Kookmin AI
      </h2>
      <div className="size-9 md:hidden" />
    </header>
  );
}
