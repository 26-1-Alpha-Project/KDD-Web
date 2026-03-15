"use client";
import type { FormEventHandler, InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface ChatInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "onSubmit"> {
  onSubmit?: FormEventHandler<HTMLFormElement>;
  sendDisabled?: boolean;
  sendLabel?: string;
}

export function ChatInput({
  className,
  onSubmit,
  placeholder = "질문을 입력하세요...",
  sendDisabled = false,
  sendLabel = "전송",
  ...rest
}: ChatInputProps) {
  return (
    <form className="relative w-full" onSubmit={onSubmit}>
      <input
        className={cn(
          "h-12 w-full rounded-[20px] border border-border-subtle bg-white py-3 pl-4 pr-12 typo-paragraph text-text-primary shadow-[0_1px_10px_0.5px_rgba(0,0,0,0.25)] placeholder:text-text-muted focus:border-kmu-blue focus:outline-none",
          className
        )}
        placeholder={placeholder}
        {...rest}
      />
      <button
        aria-label={sendLabel}
        className="absolute right-[9px] top-[9px] inline-flex h-[30px] w-[30px] items-center justify-center rounded-full bg-kmu-blue text-white transition-opacity disabled:opacity-50"
        disabled={sendDisabled}
        type="submit"
      >
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
