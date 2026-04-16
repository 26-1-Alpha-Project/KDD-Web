"use client";

import { useState, useCallback, useEffect } from "react";
import {
  getFAQList,
  getTopics,
  voteFAQ,
} from "@/lib/api/services/faq.service";
import type { FAQItem, FAQTopic } from "@/types/api/faq";

export function useFAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<Record<string, "up" | "down" | null>>({});
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [topics, setTopics] = useState<FAQTopic[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 토픽 목록 로드
  useEffect(() => {
    getTopics()
      .then((res) => setTopics(res.topics))
      .catch(() => setTopics([]));
  }, []);

  // FAQ 목록 로드
  useEffect(() => {
    setIsLoading(true);
    getFAQList({
      topic: selectedTopic !== "all" ? selectedTopic : undefined,
    })
      .then((res) => setFaqs(res.data))
      .catch(() => setFaqs([]))
      .finally(() => setIsLoading(false));
  }, [selectedTopic]);

  const filteredFAQs: FAQItem[] = faqs.filter((faq) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q)
    );
  });

  const toggleFaq = useCallback((faqId: string) => {
    setOpenFaqId((prev) => (prev === faqId ? null : faqId));
  }, []);

  const setFeedback = useCallback(
    async (faqId: string, type: "up" | "down") => {
      const current = feedbacks[faqId];
      const newVote = current === type ? null : type;

      setFeedbacks((prev) => ({ ...prev, [faqId]: newVote }));

      if (newVote !== null) {
        try {
          await voteFAQ(faqId, { voteType: newVote });
        } catch {
          // 실패 시 낙관적 업데이트 롤백
          setFeedbacks((prev) => ({ ...prev, [faqId]: current ?? null }));
        }
      }
    },
    [feedbacks]
  );

  return {
    searchQuery,
    setSearchQuery,
    selectedTopic,
    setSelectedTopic,
    openFaqId,
    toggleFaq,
    feedbacks,
    setFeedback,
    filteredFAQs,
    topics,
    isLoading,
  };
}
