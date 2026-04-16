"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Copy, RotateCcw, ChevronUp, ChevronDown, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/types/chat";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { SourceCard } from "./SourceCard";
import { StreamingMessage } from "./StreamingMessage";
import { SuggestedQuestions } from "./SuggestedQuestions";

interface ChatMessageProps {
  message: ChatMessageType;
  isStreaming?: boolean;
  onSelectQuestion?: (question: string) => void;
  onOpenPDF?: (documentId: number, page: number) => void;
}

export function ChatMessage({
  message,
  isStreaming = false,
  onSelectQuestion,
  onOpenPDF,
}: ChatMessageProps) {
  const isUser = message.role === "user";
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const hasSources = !isUser && message.sources && message.sources.length > 0;
  const hasSuggestedQuestions =
    !isUser &&
    message.suggestedQuestions &&
    message.suggestedQuestions.length > 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] md:max-w-[70%]",
          isUser && "flex flex-col items-end"
        )}
      >
        {!isUser && message.confidence && (
          <div className="mb-1.5">
            <ConfidenceBadge level={message.confidence} />
          </div>
        )}

        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-foreground"
          )}
        >
          {isStreaming && !message.content ? (
            <StreamingMessage />
          ) : (
            message.content
          )}
        </div>

        {hasSources && (
          <div className="mt-2 w-full">
            <button
              onClick={() => setSourcesOpen((prev) => !prev)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <FileText className="size-3" />
              출처 {message.sources!.length}개
              {sourcesOpen ? (
                <ChevronUp className="size-3" />
              ) : (
                <ChevronDown className="size-3" />
              )}
            </button>

            {sourcesOpen && (
              <div className="mt-2 flex flex-col gap-2">
                {message.sources!.map((source, idx) => (
                  <SourceCard
                    key={`${source.documentId}-${idx}`}
                    source={source}
                    onOpenPDF={onOpenPDF}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {hasSuggestedQuestions && onSelectQuestion && (
          <div className="mt-3">
            <SuggestedQuestions
              questions={message.suggestedQuestions!}
              onSelect={onSelectQuestion}
            />
          </div>
        )}

        {!isUser && (
          <div className="mt-2 flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="복사"
            >
              <Copy className="size-3" />
            </button>
            <button
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="좋아요"
            >
              <ThumbsUp className="size-3" />
            </button>
            <button
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="싫어요"
            >
              <ThumbsDown className="size-3" />
            </button>
            <button
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="재생성"
            >
              <RotateCcw className="size-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
