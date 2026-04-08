"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Sparkles,
  BadgeCheck,
  Clock,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_FAQ_ITEMS, MOCK_FAQ_TOPICS } from "@/constants/mock-faq";
import type { FAQItem } from "@/types/api/faq";

const CATEGORY_STYLE: Record<string, { label: string; bg: string; text: string; border: string }> = {
  academic: { label: "학사", bg: "bg-topic-academic-bg", text: "text-topic-academic-fg", border: "border-topic-academic-border" },
  graduation: { label: "졸업", bg: "bg-topic-graduation-bg", text: "text-topic-graduation-fg", border: "border-topic-graduation-border" },
  enrollment_status: { label: "휴학·복학·자퇴", bg: "bg-topic-leave-bg", text: "text-topic-leave-fg", border: "border-topic-leave-border" },
  scholarship: { label: "장학", bg: "bg-topic-scholarship-bg", text: "text-topic-scholarship-fg", border: "border-topic-scholarship-border" },
  registration: { label: "등록·학적", bg: "bg-topic-registration-bg", text: "text-topic-registration-fg", border: "border-topic-registration-border" },
  curriculum: { label: "전공·교과", bg: "bg-topic-major-bg", text: "text-topic-major-fg", border: "border-topic-major-border" },
  career: { label: "취업·현장실습", bg: "bg-topic-career-bg", text: "text-topic-career-fg", border: "border-topic-career-border" },
  event: { label: "행사·특강", bg: "bg-topic-event-bg", text: "text-topic-event-fg", border: "border-topic-event-border" },
  etc: { label: "기타", bg: "bg-topic-other-bg", text: "text-topic-other-fg", border: "border-topic-other-border" },
};

function getTopicLabel(topic: string): string {
  return CATEGORY_STYLE[topic]?.label ?? topic;
}

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

export default function FaqPage() {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<"newest" | "popular">("newest");
  const [votes, setVotes] = useState<Record<string, "up" | "down" | null>>({});

  const filtered = useMemo(() => {
    return MOCK_FAQ_ITEMS
      .filter((item) => {
        const matchCat = category === "all" || item.topic === category;
        const matchSearch =
          !search ||
          item.question.includes(search) ||
          item.answer.includes(search) ||
          item.topic.includes(search);
        return matchCat && matchSearch;
      })
      .sort((a, b) =>
        sort === "newest"
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : b.helpful - a.helpful
      );
  }, [category, search, sort]);

  const newCount = MOCK_FAQ_ITEMS.filter((f) => f.isNew).length;

  const handleVote = (id: string, type: "up" | "down") => {
    setVotes((prev) => ({ ...prev, [id]: prev[id] === type ? null : type }));
  };

  return (
    <div className="flex h-full flex-col bg-secondary">
      {/* ── Header */}
      <div className="flex h-14 shrink-0 items-center border-b border-border bg-background px-4">
        <button
          onClick={() => router.back()}
          className="mr-3 text-foreground"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h2 className="text-lg font-semibold text-foreground">
          자주 묻는 질문
        </h2>
        {newCount > 0 && (
          <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
            +{newCount} NEW
          </span>
        )}
      </div>

      {/* ── Stats bar */}
      <div className="shrink-0 border-b border-border bg-background px-4 py-3">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <BadgeCheck className="size-3.5 text-primary" />
            <span className="text-[13px] text-muted-foreground">
              총{" "}
              <span className="font-semibold text-foreground">
                {MOCK_FAQ_ITEMS.length}개
              </span>{" "}
              질문
            </span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              마지막 업데이트: 1시간 전
            </span>
          </div>
          <div className="hidden h-4 w-px bg-border sm:block" />
          <div className="flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              다음 AI 업데이트:{" "}
              <span className="text-foreground">2시간 59분</span> 후
            </span>
          </div>
        </div>
      </div>

      {/* ── Filters */}
      <div className="shrink-0 border-b border-border bg-background px-4 py-3">
        <div className="mx-auto flex max-w-4xl flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className="h-9 w-full rounded-lg bg-muted pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="질문 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {MOCK_FAQ_TOPICS.map((t) => (
                <button
                  key={t.topic}
                  onClick={() => setCategory(t.topic)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs transition-colors",
                    category === t.topic
                      ? "bg-primary font-semibold text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-secondary"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "newest" | "popular")}
              className="h-7 shrink-0 cursor-pointer appearance-none rounded-lg bg-muted px-2 text-xs text-muted-foreground outline-none"
            >
              <option value="newest">최신순</option>
              <option value="popular">인기순</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── FAQ list */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto max-w-4xl space-y-2">
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-sm text-muted-foreground">
                검색 결과가 없습니다.
              </p>
            </div>
          )}

          {filtered.map((item) => (
            <FAQCard
              key={item.faqId}
              item={item}
              isOpen={openId === item.faqId}
              onToggle={() =>
                setOpenId(openId === item.faqId ? null : item.faqId)
              }
              myVote={votes[item.faqId] ?? null}
              onVote={handleVote}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── FAQ Card ─────────────────────────────────────────────────────────────

interface FAQCardProps {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  myVote: "up" | "down" | null;
  onVote: (id: string, type: "up" | "down") => void;
}

function FAQCard({ item, isOpen, onToggle, myVote, onVote }: FAQCardProps) {
  const style = CATEGORY_STYLE[item.topic] ?? CATEGORY_STYLE["etc"];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm transition-shadow hover:shadow-md">
      <button
        onClick={onToggle}
        className="flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-secondary/30"
      >
        <span
          className={cn(
            "mt-0.5 shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold",
            style.bg,
            style.text,
            style.border
          )}
        >
          {style.label}
        </span>

        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex items-center gap-2">
            {item.isNew && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-primary">
                <Sparkles className="size-2.5" />
                NEW
              </span>
            )}
            <span className="text-[11px] text-muted-foreground">
              {timeAgo(item.createdAt)}
            </span>
          </div>
          <p className="text-sm font-medium leading-[22px] text-foreground">
            {item.question}
          </p>
        </div>

        <div className="mt-0.5 shrink-0">
          {isOpen ? (
            <ChevronUp className="size-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-border">
          <div className="flex items-center gap-1.5 px-4 pb-0 pt-3">
            <Sparkles className="size-3 text-primary" />
            <span className="text-[11px] font-semibold text-primary">
              AI 생성 답변
            </span>
          </div>

          <div className="px-4 pb-3 pt-2">
            <p className="text-sm leading-6 text-foreground/80">
              {item.answer}
            </p>
          </div>

          <div className="flex items-center gap-3 border-t border-border bg-secondary px-4 py-2.5">
            <span className="text-xs text-muted-foreground">
              이 답변이 도움이 되었나요?
            </span>
            <button
              onClick={() => onVote(item.faqId, "up")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-colors",
                myVote === "up"
                  ? "bg-vote-up-bg text-vote-up-fg"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <ThumbsUp className="size-3" />
              <span>{item.helpful + (myVote === "up" ? 1 : 0)}</span>
            </button>
            <button
              onClick={() => onVote(item.faqId, "down")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-colors",
                myVote === "down"
                  ? "bg-vote-down-bg text-vote-down-fg"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <ThumbsDown className="size-3" />
              <span>{item.notHelpful + (myVote === "down" ? 1 : 0)}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
