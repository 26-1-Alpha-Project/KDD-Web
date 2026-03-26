"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface ChatHistoryItem {
  id: string;
  title: string;
}

interface ChatHistoryProps {
  items: readonly ChatHistoryItem[];
}

export function ChatHistory({ items }: ChatHistoryProps) {
  const params = useParams();
  const activeChatId = params?.id as string | undefined;

  return (
    <div className="flex min-h-0 flex-1 flex-col px-3 pt-4">
      <p className="px-3 text-xs text-muted-foreground">채팅</p>
      <div className="mt-1 flex flex-1 flex-col gap-px overflow-y-auto">
        {items.map((item) => {
          const isActive = activeChatId === item.id;

          return (
            <Link
              key={item.id}
              href={`/chat/${item.id}`}
              className={cn(
                "flex h-[37px] items-center truncate rounded-lg px-3 text-sm font-medium text-foreground transition-colors",
                "hover:bg-secondary/80",
                isActive && "bg-[#f3f3f5]"
              )}
            >
              {item.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
