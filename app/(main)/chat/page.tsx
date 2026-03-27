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
    <div className="relative flex min-h-0 flex-1 flex-col">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex h-full max-w-3xl flex-col px-4 pt-6 pb-32">
          <ChatWelcome onSuggestionClick={handleSend} />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="h-8 bg-gradient-to-t from-white to-transparent" />
        <div className="bg-white pb-6 pt-2">
          <div className="pointer-events-auto mx-auto w-full max-w-3xl px-4 md:px-8">
            <ChatInput onSend={handleSend} />
          </div>
        </div>
      </div>
    </div>
  );
}
