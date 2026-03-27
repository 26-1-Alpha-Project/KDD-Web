"use client";

import { useEffect, useRef } from "react";
import { Pencil, Trash2 } from "lucide-react";

interface ChatItemMenuProps {
  anchorRect: DOMRect;
  onRename: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function ChatItemMenu({
  anchorRect,
  onRename,
  onDelete,
  onClose,
}: ChatItemMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const top = anchorRect.bottom + 4;
  const left = anchorRect.left;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[140px] overflow-hidden rounded-xl border border-border bg-popover py-1 shadow-lg"
      style={{ top, left }}
    >
      <button
        onClick={() => {
          onRename();
          onClose();
        }}
        className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-popover-foreground transition-colors hover:bg-secondary"
      >
        <Pencil className="size-3.5" />
        이름 변경
      </button>
      <button
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-destructive transition-colors hover:bg-secondary"
      >
        <Trash2 className="size-3.5" />
        삭제
      </button>
    </div>
  );
}
