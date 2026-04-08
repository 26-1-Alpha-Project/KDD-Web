"use client";

import { Sparkles, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SourceCard } from "@/components/chat/SourceCard";
import type { Source } from "@/types/chat";

interface FAQAnswerProps {
  answer: string;
  faqId: string;
  feedback: "up" | "down" | null;
  onFeedback: (faqId: string, type: "up" | "down") => void;
  upCount?: number;
  downCount?: number;
  sources?: Source[];
}

export function FAQAnswer({
  answer,
  faqId,
  feedback,
  onFeedback,
  upCount = 0,
  downCount = 0,
  sources,
}: FAQAnswerProps) {
  return (
    <div className="px-4 pb-4 pt-2">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-primary">
        <Sparkles className="size-3.5" />
        AI 생성 답변
      </div>
      <p className="text-sm leading-relaxed text-foreground">{answer}</p>
      {sources && sources.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">
            참고 문서
          </p>
          <div className="flex flex-col gap-2">
            {sources.map((source) => (
              <SourceCard key={`${source.documentId}-${source.page}`} source={source} />
            ))}
          </div>
        </div>
      )}
      <div className="mt-4 flex items-center gap-3">
        <span className="text-xs text-muted-foreground">
          이 답변이 도움이 되었나요?
        </span>
        <button
          type="button"
          onClick={() => onFeedback(faqId, "up")}
          className={cn(
            "flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors",
            feedback === "up"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
          aria-label="도움이 됨"
        >
          <ThumbsUp className="size-3.5" />
          <span>{upCount}</span>
        </button>
        <button
          type="button"
          onClick={() => onFeedback(faqId, "down")}
          className={cn(
            "flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors",
            feedback === "down"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
          aria-label="도움이 안 됨"
        >
          <ThumbsDown className="size-3.5" />
          <span>{downCount}</span>
        </button>
      </div>
    </div>
  );
}
