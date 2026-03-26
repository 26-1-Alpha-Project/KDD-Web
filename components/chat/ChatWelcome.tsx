import Image from "next/image";
import { MOCK_SUGGESTIONS } from "@/constants/mock";

interface ChatWelcomeProps {
  onSuggestionClick?: (text: string) => void;
}

export function ChatWelcome({ onSuggestionClick }: ChatWelcomeProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <Image
        src="/images/chat-empty-state.png"
        alt="AI Assistant"
        width={64}
        height={64}
        className="size-16"
      />
      <div className="flex flex-col items-center gap-1">
        <h2 className="text-lg font-semibold text-foreground">
          무엇이든 물어보세요
        </h2>
        <p className="text-sm text-[#4a5565]">
          국민대학교 학사 규정에 대해 답변해드립니다
        </p>
      </div>
      <div className="flex max-w-md flex-wrap justify-center gap-2">
        {MOCK_SUGGESTIONS.map((text) => (
          <button
            key={text}
            onClick={() => onSuggestionClick?.(text)}
            className="rounded-full border border-[#d9d9d9] px-5 py-2 text-sm font-medium text-[#4a5565] transition-colors hover:border-primary/30 hover:bg-accent"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
