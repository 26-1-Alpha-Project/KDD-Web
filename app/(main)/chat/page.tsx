"use client";

import { useRouter } from "next/navigation";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatWelcome } from "@/components/chat/ChatWelcome";
import { ChatInput } from "@/components/chat/ChatInput";

// 메인 채팅 페이지 — 새 채팅 / Welcome Message
// 유저플로우: 로그인 완료 → Welcome Message 표시 → 질문 입력
export default function ChatPage() {
  const router = useRouter();

  const handleSend = (message: string) => {
    // TODO: 실제 채팅 API 연동 후 채팅 생성 → /chat/[id]로 이동
    console.log("send:", message);
  };

  const handleSuggestionClick = (text: string) => {
    handleSend(text);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatHeader />
      <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col overflow-y-auto px-4 pt-6">
        <ChatWelcome onSuggestionClick={handleSuggestionClick} />
      </div>
      <div className="mx-auto w-full max-w-3xl shrink-0 px-8 pb-6 pt-2">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
