"use client";

import { useState, useRef, useCallback, useEffect, type KeyboardEvent, type MouseEvent } from "react";
import { ArrowUp, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend?: (message: string) => void;
  disabled?: boolean;
  className?: string;
  /** 마운트 시 입력창에 채워넣을 초기 텍스트 (자동 전송 안 함) */
  initialValue?: string;
}

export function ChatInput({ onSend, disabled, className, initialValue }: ChatInputProps) {
  const [value, setValue] = useState(initialValue ?? "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isSendingRef = useRef(false);

  // initialValue가 비동기로 결정되는 경우를 위한 동기화 (1회만)
  const initialValueApplied = useRef(false);
  useEffect(() => {
    if (initialValue && !initialValueApplied.current) {
      initialValueApplied.current = true;
      setValue(initialValue);
    }
  }, [initialValue]);

  const canSend = value.trim().length > 0 && !disabled && !isSendingRef.current;

  const handleSend = useCallback(() => {
    if (!value.trim() || disabled || isSendingRef.current) return;
    isSendingRef.current = true;
    onSend?.(value.trim());
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.style.height = "auto";
    }
    setTimeout(() => {
      isSendingRef.current = false;
    }, 100);
  }, [value, disabled, onSend]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleContainerClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).tagName !== "BUTTON") {
      textareaRef.current?.focus();
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      className={cn("flex cursor-text items-center gap-4 rounded-[28px] border border-border bg-white px-5 py-3 shadow-[0px_2px_12px_0px_rgba(0,0,0,0.08)]", className)}
    >
      <button
        type="button"
        disabled
        className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground/50"
        aria-label="파일 첨부 (준비 중)"
      >
        <Paperclip className="size-5" />
      </button>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요..."
        rows={1}
        className="max-h-40 flex-1 resize-none overflow-y-auto scrollbar-none bg-transparent text-base leading-6 text-foreground outline-none field-sizing-content placeholder:text-muted-foreground"
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
        <ArrowUp className="size-5" />
      </button>
    </div>
  );
}
