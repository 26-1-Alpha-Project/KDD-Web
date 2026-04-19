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
import { getSessionDetail } from "@/lib/api/services/chat.service";
import type { ChatMessage } from "@/types/chat";
import type { SSEEvent, ChatMessageResponse } from "@/types/api/chat";

type Props = { params: Promise<{ id: string }> };

interface PDFViewerState {
  open: boolean;
  fileUrl: string;
  title: string;
  initialPage?: number;
}

function buildMessagesFromEvents(events: SSEEvent[]): Partial<ChatMessage> {
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

function mapApiMessageToLocal(msg: ChatMessageResponse): ChatMessage {
  return {
    messageId: String(msg.messageId),
    role: msg.role,
    content: msg.content,
    confidence: (msg.confidence as ChatMessage["confidence"]) ?? undefined,
    sources: msg.sources.map((s) => ({
      documentId: s.documentId,
      documentTitle: s.documentTitle,
      page: s.page,
    })),
    createdAt: msg.createdAt,
  };
}

export default function ChatDetailPage({ params }: Props) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const { renameChat } = useChatContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const initialQueryHandled = useRef(false);

  const [pdfViewer, setPdfViewer] = useState<PDFViewerState>({
    open: false,
    fileUrl: "",
    title: "",
    initialPage: undefined,
  });

  const { events, isStreaming, sendMessage, reset } = useSSEStream(id);

  // 세션 상세 로드 (히스토리 메시지)
  // 초기 1회만 서버 응답으로 채운다. fetch가 늦게 resolve돼서 유저가 이미 새 메시지를 추가한
  // 상태를 덮어쓰면 방금 나눈 대화가 통째로 사라진다 (StrictMode 중복 fetch에서 특히 잘 터짐).
  useEffect(() => {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      setSessionLoaded(true);
      return;
    }
    let cancelled = false;
    getSessionDetail(numericId)
      .then((res) => {
        if (cancelled) return;
        if (res.messages.length === 0) return;
        setMessages((prev) =>
          prev.length === 0 ? res.messages.map(mapApiMessageToLocal) : prev
        );
      })
      .catch(() => {
        // 세션 로드 실패 시 빈 메시지로 시작
      })
      .finally(() => {
        if (!cancelled) setSessionLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  // SSE 이벤트로부터 fallback/error 이벤트 추출
  const fallbackEvent = events.find((e) => e.type === "fallback");
  const errorEvent = events.find((e) => e.type === "error");

  // 스트리밍 완료 시 메시지 목록에 추가 + 서버 제목 동기화
  // done 이벤트가 누락되거나 포맷이 스펙과 달라도 누적된 텍스트가 있으면 반드시 확정한다.
  // (done 필수 조건이면 스트림이 닫힌 직후 streamingText가 사라지면서 응답이 통째로 소실된다)
  useEffect(() => {
    if (isStreaming) return;
    if (fallbackEvent || errorEvent) return;

    const partial = buildMessagesFromEvents(events);

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

      // 백엔드가 생성한 세션 제목으로 사이드바 동기화
      const numericId = Number(id);
      if (!isNaN(numericId)) {
        getSessionDetail(numericId)
          .then((res) => renameChat(id, res.title))
          .catch(() => {});
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStreaming]);

  const handleSend = (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      messageId: `${id}-${Date.now()}`,
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    sendMessage(trimmed);
  };

  const handleOpenPDF = (documentId: number, page: number) => {
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
    if (!sessionLoaded) return;
    if (initialQueryHandled.current) return;
    const q = searchParams.get("q");
    if (q && messages.length === 0) {
      initialQueryHandled.current = true;
      handleSend(q);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionLoaded]);

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
