"use client";

import { use, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatWelcome } from "@/components/chat/ChatWelcome";
import { ChatMessageList } from "@/components/chat/ChatMessageList";
import { FallbackMessage } from "@/components/chat/FallbackMessage";
import { PDFViewer } from "@/components/shared/PDFViewer";
import { useChatContext } from "@/components/chat/ChatContext";
import { useSSEStream } from "@/hooks/useSSEStream";
import { MOCK_CHAT_SESSIONS } from "@/constants/mock";
import type { ChatMessage } from "@/types/chat";
import type { SSEEvent } from "@/types/api/chat";

type Props = { params: Promise<{ id: string }> };

interface PDFViewerState {
  open: boolean;
  fileUrl: string;
  title: string;
  initialPage?: number;
}

function buildMessagesFromEvents(
  events: SSEEvent[]
): Partial<ChatMessage> {
  let content = "";
  let confidence: ChatMessage["confidence"] | undefined;
  let sources: ChatMessage["sources"] | undefined;
  let suggestedQuestions: string[] | undefined;

  for (const event of events) {
    if (event.type === "text") {
      content += event.content;
    } else if (event.type === "meta") {
      confidence = event.confidence;
      if (event.sources) {
        sources = event.sources.map((s) => ({
          documentId: s.documentId,
          documentTitle: s.documentTitle,
          page: s.page,
        }));
      }
    } else if (event.type === "fallback") {
      suggestedQuestions = event.suggestedQuestions;
    }
  }

  return { content, confidence, sources, suggestedQuestions };
}

export default function ChatDetailPage({ params }: Props) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const { addChat } = useChatContext();
  const session = MOCK_CHAT_SESSIONS[id];
  const [messages, setMessages] = useState<ChatMessage[]>(
    session?.messages ?? []
  );
  const initialQueryHandled = useRef(false);

  const [pdfViewer, setPdfViewer] = useState<PDFViewerState>({
    open: false,
    fileUrl: "",
    title: "",
    initialPage: undefined,
  });

  const { events, isStreaming, sendMessage, reset } = useSSEStream(id);

  // SSE 이벤트로부터 fallback/error 이벤트 추출
  const fallbackEvent = events.find((e) => e.type === "fallback");
  const errorEvent = events.find((e) => e.type === "error");

  // 스트리밍 완료 시 메시지 목록에 추가
  useEffect(() => {
    const doneEvent = events.find((e) => e.type === "done");
    if (!doneEvent || isStreaming) return;

    const partial = buildMessagesFromEvents(events);

    if (fallbackEvent) {
      // fallback은 별도 UI로 처리 — 메시지로 추가하지 않음
      return;
    }

    if (partial.content) {
      const assistantMessage: ChatMessage = {
        messageId: `${id}-${Date.now()}-reply`,
        role: "assistant",
        content: partial.content,
        confidence: partial.confidence,
        sources: partial.sources,
        suggestedQuestions: partial.suggestedQuestions,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      reset();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStreaming]);

  const handleSend = (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;
    const isFirstMessage = messages.length === 0;

    const userMessage: ChatMessage = {
      messageId: `${id}-${Date.now()}`,
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    if (isFirstMessage) {
      const title =
        trimmed.length > 20 ? trimmed.slice(0, 20) + "..." : trimmed;
      addChat(id, title);
    }

    sendMessage(trimmed);
  };

  const handleOpenPDF = (documentId: string, page: number) => {
    setPdfViewer({
      open: true,
      fileUrl: `/api/documents/${documentId}`,
      title: `문서 (${documentId})`,
      initialPage: page,
    });
  };

  const handleClosePDF = () => {
    setPdfViewer((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (initialQueryHandled.current) return;
    const q = searchParams.get("q");
    if (q && messages.length === 0) {
      initialQueryHandled.current = true;
      handleSend(q);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isEmpty = messages.length === 0 && !isStreaming;

  // 스트리밍 중 현재 누적된 텍스트
  const streamingText = events
    .filter((e) => e.type === "text")
    .map((e) => (e.type === "text" ? e.content : ""))
    .join("");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatHeader />
      <div className="relative min-h-0 flex-1">
        <div className="h-full overflow-y-auto pb-24">
          {isEmpty ? (
            <div className="mx-auto flex h-full max-w-3xl flex-col px-4 pt-6">
              <ChatWelcome onSuggestionClick={handleSend} />
            </div>
          ) : (
            <div className="mx-auto max-w-3xl px-4 pt-6">
              <ChatMessageList
                messages={messages}
                isStreaming={isStreaming && !streamingText && !fallbackEvent && !errorEvent}
                onSelectQuestion={handleSend}
                onOpenPDF={handleOpenPDF}
              />

              {isStreaming && streamingText && (
                <div className="mt-6 flex justify-start">
                  <div className="max-w-[85%] rounded-2xl bg-secondary px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap text-foreground md:max-w-[70%]">
                    {streamingText}
                  </div>
                </div>
              )}

              {!isStreaming && fallbackEvent && (
                <div className="mt-6">
                  <FallbackMessage
                    type="fallback"
                    message={fallbackEvent.message}
                    suggestedQuestions={fallbackEvent.suggestedQuestions}
                    onSelectQuestion={handleSend}
                  />
                </div>
              )}

              {!isStreaming && errorEvent && (
                <div className="mt-6">
                  <FallbackMessage
                    type="error"
                    message={errorEvent.message}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <ChatInput
          onSend={handleSend}
          disabled={isStreaming}
          className="absolute inset-x-0 bottom-6 mx-auto w-[calc(100%-2rem)] max-w-184"
        />
      </div>

      <PDFViewer
        open={pdfViewer.open}
        onClose={handleClosePDF}
        fileUrl={pdfViewer.fileUrl}
        title={pdfViewer.title}
        initialPage={pdfViewer.initialPage}
      />
    </div>
  );
}
