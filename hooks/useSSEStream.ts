"use client";

import { useState, useCallback, useRef } from "react";
import type { SSEEvent } from "@/types/api/chat";
import {
  MOCK_SSE_SEQUENCE_HIGH,
  MOCK_SSE_SEQUENCE_LOW,
  MOCK_SSE_FALLBACK,
} from "@/constants/mock-chat";

interface UseSSEStreamReturn {
  events: SSEEvent[];
  isStreaming: boolean;
  error: string | null;
  sendMessage: (content: string) => void;
  reset: () => void;
}

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export function useSSEStream(sessionId: string): UseSSEStreamReturn {
  const [events, setEvents] = useState<SSEEvent[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageCountRef = useRef(0);

  const reset = useCallback(() => {
    setEvents([]);
    setIsStreaming(false);
    setError(null);
  }, []);

  const sendMessageMock = useCallback((content: string) => {
    if (!content.trim()) return;

    messageCountRef.current += 1;
    const count = messageCountRef.current;

    const sequence =
      count % 10 === 0
        ? [MOCK_SSE_FALLBACK]
        : count % 3 === 0
          ? MOCK_SSE_SEQUENCE_LOW
          : MOCK_SSE_SEQUENCE_HIGH;

    setIsStreaming(true);
    setEvents([]);
    setError(null);

    sequence.forEach((event, index) => {
      const delay = 100 + index * (150 + Math.random() * 150);
      setTimeout(() => {
        setEvents((prev) => [...prev, event]);
        if (index === sequence.length - 1) {
          setIsStreaming(false);
        }
      }, delay);
    });
  }, []);

  const sendMessageReal = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      setIsStreaming(true);
      setEvents([]);
      setError(null);

      try {
        const response = await fetch(
          `/chat/sessions/${sessionId}/messages`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        if (!response.body) {
          throw new Error("Response body is null");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data: ")) continue;

            const jsonStr = trimmed.slice("data: ".length);
            try {
              const event = JSON.parse(jsonStr) as SSEEvent;
              setEvents((prev) => [...prev, event]);
            } catch {
              // JSON 파싱 실패 시 무시
            }
          }
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
        setError(message);
      } finally {
        setIsStreaming(false);
      }
    },
    [sessionId]
  );

  const sendMessage = USE_MOCK ? sendMessageMock : sendMessageReal;

  return { events, isStreaming, error, sendMessage, reset };
}
