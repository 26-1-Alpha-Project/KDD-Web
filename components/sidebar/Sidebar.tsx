"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence } from "motion/react";
import {
  Search,
  SquarePen,
  FileText,
  CircleHelp,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_CHAT_HISTORY } from "@/constants/mock";
import { ChatHistory } from "./ChatHistory";
import { SearchModal } from "./SearchModal";

const NAV_ITEMS = [
  { href: "/chat", label: "새 채팅", icon: SquarePen },
  { href: "/resources", label: "자료", icon: FileText },
  { href: "/faq", label: "FAQ", icon: CircleHelp },
  { href: "/settings", label: "설정", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);

  const handleSearchOpen = () => {
    if (triggerRef.current) {
      setTriggerRect(triggerRef.current.getBoundingClientRect());
    }
    setSearchOpen(true);
  };

  return (
    <>
      <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-black/10 bg-white">
        {/* 검색 트리거 — 항상 렌더링, 모달 열리면 투명하게 */}
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

        {/* 내비게이션 */}
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

        {/* 채팅 히스토리 */}
        <ChatHistory items={MOCK_CHAT_HISTORY} />

        {/* 로그아웃 */}
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
            chatHistory={MOCK_CHAT_HISTORY}
            triggerRect={triggerRect}
          />
        )}
      </AnimatePresence>
    </>
  );
}
