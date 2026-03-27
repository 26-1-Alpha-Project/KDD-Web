"use client";

import { use, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatWelcome } from "@/components/chat/ChatWelcome";
import { ChatMessageList } from "@/components/chat/ChatMessageList";
import { useChatContext } from "@/components/chat/ChatContext";
import { MOCK_CHAT_SESSIONS } from "@/constants/mock";
import type { ChatMessage } from "@/types/chat";

type Props = { params: Promise<{ id: string }> };

export default function ChatDetailPage({ params }: Props) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const { addChat } = useChatContext();
  const session = MOCK_CHAT_SESSIONS[id];
  const [messages, setMessages] = useState<ChatMessage[]>(
    session?.messages ?? []
  );
  const initialQueryHandled = useRef(false);

  useEffect(() => {
    if (initialQueryHandled.current) return;
    const q = searchParams.get("q");
    if (q && messages.length === 0) {
      initialQueryHandled.current = true;
      handleSend(q);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = (content: string) => {
    const isFirstMessage = messages.length === 0;

    const userMessage: ChatMessage = {
      id: `${id}-${Date.now()}`,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    if (isFirstMessage) {
      const title =
        content.length > 20 ? content.slice(0, 20) + "..." : content;
      addChat(id, title);
    }

    // TODO: API 연동 시 실제 응답으로 교체
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `${id}-${Date.now()}-reply`,
        role: "assistant",
        content:
          "안녕하세요! 국민대학교 학사 규정에 대해 도움을 드리겠습니다.\n\n질문을 좀 더 구체적으로 해주시면 정확한 답변을 드릴 수 있습니다. 예를 들어:\n\n• \"이번 학기 휴학 신청 기간이 언제야?\"\n• \"수강신청 방법 알려줘\"\n• \"장학금 종류가 뭐가 있어?\"",
        confidence: "medium",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 800);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatHeader />
      {isEmpty ? (
        <div className="mx-auto flex flex-1 max-w-3xl flex-col overflow-y-auto px-4 pt-6">
          <ChatWelcome onSuggestionClick={handleSend} />
        </div>
      ) : (
        <div className="mx-auto flex-1 w-full max-w-3xl overflow-y-auto px-4 pt-6 pb-4">
          <ChatMessageList messages={messages} />
        </div>
      )}
      <ChatInput onSend={handleSend} className="shrink-0 mx-auto w-full max-w-3xl px-4 mt-2 mb-6" />
    </div>
  );
}
