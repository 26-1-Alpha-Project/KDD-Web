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
      <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="mx-auto flex flex-1 max-w-3xl flex-col px-4 pt-6">
          <ChatWelcome onSuggestionClick={handleSend} />
        </div>
        <div className="sticky bottom-0 mx-auto w-full max-w-3xl px-4 pt-4 pb-6 md:px-8">
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
