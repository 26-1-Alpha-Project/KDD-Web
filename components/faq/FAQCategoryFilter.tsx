"use client";

import { cn } from "@/lib/utils";
import type { FAQTopic } from "@/types/api/faq";

interface FAQCategoryFilterProps {
  topics: FAQTopic[];
  selectedTopic: string;
  onSelect: (topic: string) => void;
}

export function FAQCategoryFilter({
  topics,
  selectedTopic,
  onSelect,
}: FAQCategoryFilterProps) {
  return (
    <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
      {topics.map((topic) => (
        <button
          key={topic.topic}
          onClick={() => onSelect(topic.topic)}
          className={cn(
            "shrink-0 cursor-pointer rounded-full px-3 py-1 text-sm transition-colors",
            selectedTopic === topic.topic
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          {topic.label}
        </button>
      ))}
    </div>
  );
}
