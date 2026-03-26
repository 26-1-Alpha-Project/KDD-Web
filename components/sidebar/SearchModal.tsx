"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Search, SquarePen, MessageCircle, X } from "lucide-react";

interface ChatHistoryItem {
  id: string;
  title: string;
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  chatHistory: readonly ChatHistoryItem[];
  triggerRect: DOMRect | null;
}

export function SearchModal({
  open,
  onClose,
  chatHistory,
  triggerRect,
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = chatHistory.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleClose = useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  // ESC 키로 닫기
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleClose]);

  // 스크롤 잠금
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  if (!open) return null;

  // 트리거 위치 → 모달 목표 위치 간 오프셋 계산
  const modalTargetX = window.innerWidth / 2;
  const modalTargetY = window.innerHeight * 0.15 + 24; // pt-[15vh] + 약간의 여백

  const originX = triggerRect
    ? triggerRect.left + triggerRect.width / 2 - modalTargetX
    : 0;
  const originY = triggerRect
    ? triggerRect.top + triggerRect.height / 2 - modalTargetY
    : 40;
  const scaleX = triggerRect ? triggerRect.width / 480 : 0.5;
  const scaleY = triggerRect ? triggerRect.height / 48 : 0.5;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      {/* 배경 딤 */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
      />

      {/* 모달 */}
      <motion.div
        className="relative w-full max-w-120 px-4"
        initial={{
          x: originX,
          y: originY,
          scaleX,
          scaleY,
          opacity: 0,
        }}
        animate={{
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
        }}
        exit={{
          x: originX,
          y: originY,
          scaleX,
          scaleY,
          opacity: 0,
        }}
        transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
        style={{ borderRadius: 16, transformOrigin: "top left" }}
        onAnimationComplete={() => inputRef.current?.focus()}
      >
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* 검색 입력 */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Search className="size-[18px] shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="채팅 검색..."
              className="flex-1 bg-transparent text-sm caret-primary outline-none placeholder:text-muted-foreground"
            />
            <button
              onClick={handleClose}
              className="shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* 결과 목록 */}
          <motion.div
            className="max-h-[50vh] overflow-y-auto p-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.2 }}
          >
            {/* 새 채팅 */}
            <button
              onClick={() => {
                router.push("/chat");
                handleClose();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <SquarePen className="size-4" />
              새 채팅
            </button>

            {/* 히스토리 섹션 */}
            {filtered.length > 0 && (
              <>
                <p className="px-3 pt-3 pb-1 text-xs text-muted-foreground">
                  {query ? "검색 결과" : "지난 30일"}
                </p>
                {filtered.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      router.push(`/chat/${item.id}`);
                      handleClose();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    <MessageCircle className="size-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{item.title}</span>
                  </button>
                ))}
              </>
            )}

            {/* 검색 결과 없음 */}
            {query && filtered.length === 0 && (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                검색 결과가 없습니다
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
