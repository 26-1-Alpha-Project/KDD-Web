"use client";

import { useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  Search,
  SquarePen,
  FileText,
  CircleHelp,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";
import { ChatHistory } from "./ChatHistory";
import { SearchModal } from "./SearchModal";
import { useChatContext } from "@/components/chat/ChatContext";

const NAV_ITEMS = [
  { href: "/chat", label: "새 채팅", icon: SquarePen },
  { href: "/resources", label: "자료", icon: FileText },
  { href: "/faq", label: "FAQ", icon: CircleHelp },
  { href: "/admin", label: "관리자", icon: ShieldCheck },
  { href: "/settings", label: "설정", icon: Settings },
] as const;

interface SidebarContentProps {
  onNavigate?: () => void;
}

function SidebarContent({ onNavigate }: SidebarContentProps) {
  const pathname = usePathname();
  const { chatHistory, deleteChat, renameChat } = useChatContext();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);

  const handleSearchOpen = () => {
    if (triggerRef.current) {
      setTriggerRect(triggerRef.current.getBoundingClientRect());
    }
    setSearchOpen(true);
  };

  const handleDeleteChat = (id: string) => {
    deleteChat(id);
    if (pathname === `/chat/${id}`) {
      router.push("/chat");
    }
  };

  return (
    <>
      <aside className="flex h-full w-[260px] shrink-0 flex-col bg-white">

        <div className="px-4 pt-6 pb-2">
          <button
            ref={triggerRef}
            onClick={handleSearchOpen}
            className="relative flex h-11 w-full cursor-text items-center rounded-2xl bg-white pl-10 pr-4 text-sm text-foreground/50 shadow-[0px_0px_5px_0.5px_rgba(0,0,0,0.15)] transition-colors hover:bg-secondary/50"
          >
            <Search className="absolute left-3 top-1/2 size-[15px] -translate-y-1/2" />
            채팅 검색...
          </button>
        </div>

        <nav className="flex flex-col gap-0.5 px-3 pt-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/chat"
                ? pathname === "/chat"
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                className={cn(
                  "flex h-[37px] items-center gap-3 rounded-[10px] px-3 text-sm font-medium text-foreground transition-colors",
                  "hover:bg-secondary",
                  isActive && href !== "/chat" && "bg-secondary"
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <ChatHistory
          items={chatHistory}
          onNavigate={onNavigate}
          onRename={renameChat}
          onDelete={handleDeleteChat}
        />

        <div className="mt-auto px-4 pb-4">
          <button className="flex h-9 w-full items-center justify-center gap-2 rounded-[10px] border border-black/10 text-xs font-medium text-foreground transition-colors hover:bg-secondary">
            <LogOut className="size-3.5" />
            로그아웃
          </button>
        </div>
      </aside>

      <AnimatePresence>
        {searchOpen && (
          <SearchModal
            open={searchOpen}
            onClose={() => setSearchOpen(false)}
            chatHistory={chatHistory}
            triggerRect={triggerRect}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export function Sidebar() {
  const { open, setOpen } = useSidebar();

  return (
    <>
      <div className="hidden md:flex h-full shrink-0 border-r border-black/10">
        <SidebarContent />
      </div>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-40 md:hidden">
            <motion.div
              className="absolute inset-0 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="absolute left-0 top-0 h-full shadow-xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
            >
              <SidebarContent onNavigate={() => setOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
