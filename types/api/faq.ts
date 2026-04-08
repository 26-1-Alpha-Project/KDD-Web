import type { Source } from "@/types/chat";

export interface FAQItem {
  faqId: string;
  question: string;
  answer: string;
  topic: string;
  createdAt: string;
  helpful: number;
  notHelpful: number;
  isNew?: boolean;
  sources?: Source[];
}

export interface FAQTopic {
  topic: string;
  label: string;
}
