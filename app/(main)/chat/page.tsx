"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatWelcome } from "@/components/chat/ChatWelcome";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChatContext } from "@/components/chat/ChatContext";
import { getRecommendedQuestions } from "@/lib/api/services/chat.service";
import type { RecommendedQuestion } from "@/types/api/chat";

export default function ChatPage() {
  const router = useRouter();
  const { createNewSession } = useChatContext();
  const [recommendations, setRecommendations] = useState<RecommendedQuestion[]>([]);

  useEffect(() => {
    getRecommendedQuestions()
      .then((res) => setRecommendations(res.questions))
      .catch(() => setRecommendations([]));
  }, []);

  const handleSend = async (message: string) => {
    try {
      const sessionId = await createNewSession();
      router.push(`/chat/${sessionId}?q=${encodeURIComponent(message)}`);
    } catch {
      // 세션 생성 실패 시 임시 id로 이동
      const tempId = `new-${Date.now()}`;
      router.push(`/chat/${tempId}?q=${encodeURIComponent(message)}`);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatHeader />
      <div className="relative min-h-0 flex-1">
        <div className="mx-auto flex h-full max-w-3xl flex-col overflow-y-auto px-4 pt-6 pb-24">
          <ChatWelcome
            onSuggestionClick={handleSend}
            recommendations={recommendations}
          />
        </div>
        <ChatInput
          onSend={handleSend}
          className="absolute inset-x-0 bottom-6 mx-auto w-[calc(100%-2rem)] max-w-184"
        />
      </div>
    </div>
  );
}
