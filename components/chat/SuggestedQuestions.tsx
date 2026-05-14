"use client";

import { cn } from "@/lib/utils";

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
  className?: string;
}

export function SuggestedQuestions({
  questions,
  onSelect,
  className,
}: SuggestedQuestionsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {questions.map((question) => (
        <button
          key={question}
          onClick={() => onSelect(question)}
          className="rounded-full bg-primary/10 px-3 py-1.5 text-sm text-primary transition-colors hover:bg-primary/20"
        >
          {question}
        </button>
      ))}
    </div>
  );
}
