"use client";

import { useState, useCallback } from "react";
import { MOCK_FAQ_ITEMS } from "@/constants/mock-faq";
import { MOCK_FAQ_CANDIDATES } from "@/constants/mock-admin";
import type { FAQItem } from "@/types/api/faq";
import type { FAQCandidate } from "@/types/api/admin";

type ActiveTab = "registered" | "candidates";

export function useAdminFAQ() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("registered");
  const [faqs, setFaqs] = useState<FAQItem[]>(MOCK_FAQ_ITEMS);
  const [candidates, setCandidates] =
    useState<FAQCandidate[]>(MOCK_FAQ_CANDIDATES);

  const deleteFAQ = useCallback((id: string) => {
    setFaqs((prev) => prev.filter((faq) => faq.faqId !== id));
  }, []);

  const approveCandidate = useCallback((id: string) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.candidateId === id ? { ...c, status: "approved" as const } : c
      )
    );
  }, []);

  const rejectCandidate = useCallback((id: string) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.candidateId === id ? { ...c, status: "rejected" as const } : c
      )
    );
  }, []);

  return {
    activeTab,
    setActiveTab,
    faqs,
    candidates,
    deleteFAQ,
    approveCandidate,
    rejectCandidate,
  };
}
