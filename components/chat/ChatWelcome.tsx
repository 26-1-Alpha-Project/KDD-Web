"use client";

import Image from "next/image";
import { TrendingUp, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { RecommendedQuestion } from "@/types/api/chat";

interface ChatWelcomeProps {
  onSuggestionClick?: (text: string) => void;
  recommendations?: RecommendedQuestion[];
  isLoading?: boolean;
}

const SKELETON_ITEMS = Array.from({ length: 5 });

export function ChatWelcome({
  onSuggestionClick,
  recommendations,
  isLoading,
}: ChatWelcomeProps) {
  const questions = recommendations ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        {/* Hero 스켈레톤 */}
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="size-14 rounded-full" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>

        {/* TOP 5 추천 질문 스켈레톤 */}
        <div className="w-full max-w-sm">
          <div className="mb-2 flex items-center gap-2 px-1">
            <Skeleton className="size-4 rounded" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="flex flex-col gap-1.5">
            {SKELETON_ITEMS.map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2"
              >
                <Skeleton className="size-5 shrink-0 rounded" />
                <Skeleton
                  className="h-4 flex-1"
                  style={{ maxWidth: `${80 - i * 8}%` }}
                />
                <Skeleton className="size-3 shrink-0 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8">
      {/* Hero */}
      <div className="text-center">
        <Image
          src="/images/chat-empty-state.png"
          alt="AI 어시스턴트"
          width={56}
          height={56}
          className="mx-auto mb-3 size-14"
        />
        <p className="text-xl font-bold text-foreground">
          무엇이든 물어보세요
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          국민대학교 학사 규정에 대해 답변해드립니다
        </p>
      </div>

      {/* TOP 5 추천 질문 — 데이터가 없으면 숨김 */}
      {questions.length > 0 && (
      <div className="w-full max-w-sm">
        <div className="mb-2 flex items-center gap-2 px-1">
          <div className="flex size-4 items-center justify-center rounded bg-primary/10">
            <TrendingUp className="size-2.5 text-primary" />
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            TOP 5 추천 질문
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          {questions.map((item, i) => (
            <button
              key={item.questionId}
              onClick={() => onSuggestionClick?.(item.content)}
              className="group flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2 text-left transition-all hover:border-primary/30 hover:bg-accent/50"
            >
              <span
                className={`flex size-5 shrink-0 items-center justify-center rounded text-[10px] font-bold transition-colors ${
                  i < 3
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                }`}
              >
                {i + 1}
              </span>
              <p className="min-w-0 flex-1 truncate text-[13px] font-medium text-foreground">
                {item.content}
              </p>
              <Sparkles
                size={12}
                className="shrink-0 text-muted-foreground/30 transition-colors group-hover:text-primary"
              />
            </button>
          ))}
        </div>
      </div>
      )}
    </div>
  );
}
