"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend?: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = value.trim().length > 0 && !disabled;

  const handleSend = () => {
    if (!canSend) return;
    onSend?.(value.trim());
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-4 rounded-[28px] border border-gray-100 bg-white px-5 py-3 shadow-[0px_2px_12px_0px_rgba(0,0,0,0.08)] md:gap-6 md:px-9">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요..."
        rows={1}
        className="max-h-40 flex-1 resize-none overflow-y-auto bg-transparent text-base leading-6 text-foreground outline-none field-sizing-content placeholder:text-[#99a1af]"
      />
      <button
        onClick={handleSend}
        disabled={!canSend}
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full transition-colors",
          canSend
            ? "bg-primary text-white hover:bg-primary/85"
            : "bg-primary/30 text-white"
        )}
      >
        <ArrowUp className="size-[18px]" />
      </button>
    </div>
  );
}
