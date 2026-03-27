"use client";

import { useRouter } from "next/navigation";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatWelcome } from "@/components/chat/ChatWelcome";
import { ChatInput } from "@/components/chat/ChatInput";

export default function ChatPage() {
  const router = useRouter();

  const handleSend = (message: string) => {
    // TODO: 실제 채팅 API 연동 후 새 세션 생성 → /chat/[id]로 이동
    const newId = `new-${Date.now()}`;
    router.push(`/chat/${newId}?q=${encodeURIComponent(message)}`);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatHeader />
      <div className="mx-auto flex flex-1 max-w-3xl flex-col overflow-y-auto px-4 pt-6">
        <ChatWelcome onSuggestionClick={handleSend} />
      </div>
      <ChatInput onSend={handleSend} className="shrink-0 mx-4 md:mx-auto max-w-3xl mt-2 mb-6" />
    </div>
  );
}
