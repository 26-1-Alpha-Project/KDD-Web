"use client";

import { useState, useCallback, useMemo } from "react";
import { MOCK_FAQ_ITEMS, MOCK_FAQ_TOPICS } from "@/constants/mock-faq";
import type { FAQItem, FAQTopic } from "@/types/api/faq";

export function useFAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<
    Record<string, "up" | "down" | null>
  >({});

  const topics: FAQTopic[] = MOCK_FAQ_TOPICS;

  const filteredFAQs: FAQItem[] = useMemo(() => {
    return MOCK_FAQ_ITEMS.filter((faq) => {
      const matchesTopic =
        selectedTopic === "all" || faq.topic === selectedTopic;
      const matchesSearch =
        searchQuery.trim() === "" ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTopic && matchesSearch;
    });
  }, [selectedTopic, searchQuery]);

  const toggleFaq = useCallback((faqId: string) => {
    setOpenFaqId((prev) => (prev === faqId ? null : faqId));
  }, []);

  const setFeedback = useCallback(
    (faqId: string, type: "up" | "down") => {
      setFeedbacks((prev) => ({
        ...prev,
        [faqId]: prev[faqId] === type ? null : type,
      }));
    },
    []
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
  };
}
