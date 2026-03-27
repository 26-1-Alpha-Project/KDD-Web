"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Ellipsis } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatItemMenu } from "./ChatItemMenu";

interface ChatHistoryItem {
  id: string;
  title: string;
}

interface ChatHistoryProps {
  items: readonly ChatHistoryItem[];
  onNavigate?: () => void;
  onRename?: (id: string, newTitle: string) => void;
  onDelete?: (id: string) => void;
}

export function ChatHistory({
  items,
  onNavigate,
  onRename,
  onDelete,
}: ChatHistoryProps) {
  const params = useParams();
  const activeChatId = params?.id as string | undefined;
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);
  const renameHandledRef = useRef(false);

  const startRename = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    renameHandledRef.current = false;
    setEditingId(id);
    setEditValue(item.title);
  };

  const commitRename = () => {
    if (renameHandledRef.current) return;
    renameHandledRef.current = true;
    if (editingId && editValue.trim()) {
      onRename?.(editingId, editValue.trim());
    }
    setEditingId(null);
    setEditValue("");
  };

  const cancelRename = () => {
    if (renameHandledRef.current) return;
    renameHandledRef.current = true;
    setEditingId(null);
    setEditValue("");
  };

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  return (
    <div className="flex min-h-0 flex-1 flex-col px-3 pt-4">
      <p className="px-3 text-xs text-muted-foreground">채팅</p>
      <div className="mt-1 flex flex-1 flex-col gap-px overflow-y-auto">
        {items.map((item) => {
          const isActive = activeChatId === item.id;
          const isEditing = editingId === item.id;

          return (
            <div
              key={item.id}
              className="group relative flex items-center"
            >
              {isEditing ? (
                <input
                  ref={editInputRef}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitRename();
                    if (e.key === "Escape") cancelRename();
                  }}
                  className="flex h-[37px] w-full items-center rounded-lg border border-ring bg-background px-3 text-sm font-medium text-foreground outline-none"
                />
              ) : (
                <>
                  <Link
                    href={`/chat/${item.id}`}
                    onClick={onNavigate}
                    className={cn(
                      "flex h-[37px] w-full items-center truncate rounded-lg px-3 pr-8 text-sm font-medium text-foreground transition-colors",
                      "hover:bg-secondary/80",
                      isActive && "bg-secondary"
                    )}
                  >
                    {item.title}
                  </Link>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMenuOpenId((prev) =>
                        prev === item.id ? null : item.id
                      );
                    }}
                    className={cn(
                      "absolute right-1 flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:opacity-100",
                      menuOpenId === item.id
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    )}
                    aria-label="채팅 옵션"
                  >
                    <Ellipsis className="size-4" />
                  </button>

                  {menuOpenId === item.id && (
                    <ChatItemMenu
                      onRename={() => startRename(item.id)}
                      onDelete={() => onDelete?.(item.id)}
                      onClose={() => setMenuOpenId(null)}
                    />
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
