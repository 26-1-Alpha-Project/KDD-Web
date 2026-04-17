"use client";

import { useState, useCallback, useRef } from "react";
import { authManager } from "@/lib/api/auth";
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
      const delayMs = 100 + index * (150 + Math.random() * 150);
      setTimeout(() => {
        setEvents((prev) => [...prev, event]);
        if (index === sequence.length - 1) {
          setIsStreaming(false);
        }
      }, delayMs);
    });
  }, []);

  const sendMessageReal = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      setIsStreaming(true);
      setEvents([]);
      setError(null);

      try {
        // SSE는 Next.js rewrites 프록시의 버퍼링 문제를 피하기 위해 백엔드에 직접 요청
        const baseUrl = (
          process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"
        ).replace(/\/+$/, "");

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        };
        const token = authManager.getToken();
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
          `${baseUrl}/chat/sessions/${sessionId}/messages`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({ content }),
          }
        );

        if (!response.ok) {
          throw new Error(`SSE 요청 실패: ${response.status}`);
        }

        if (!response.body) {
          throw new Error("Response body is null");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        const processFrame = (frame: string) => {
          const dataLines: string[] = [];
          for (const rawLine of frame.split("\n")) {
            const line = rawLine.replace(/\r$/, "");
            if (!line.startsWith("data:")) continue;
            dataLines.push(line.startsWith("data: ") ? line.slice(6) : line.slice(5));
          }
          if (dataLines.length === 0) return;
          const jsonStr = dataLines.join("\n");
          try {
            const event = JSON.parse(jsonStr) as SSEEvent;
            setEvents((prev) => [...prev, event]);
          } catch {
            // JSON 파싱 실패 시 무시
          }
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // SSE 이벤트 경계는 빈 줄(\n\n 또는 \r\n\r\n)
          let boundary = buffer.search(/\r?\n\r?\n/);
          while (boundary !== -1) {
            const frame = buffer.slice(0, boundary);
            const match = buffer.slice(boundary).match(/^\r?\n\r?\n/);
            buffer = buffer.slice(boundary + (match ? match[0].length : 2));
            processFrame(frame);
            boundary = buffer.search(/\r?\n\r?\n/);
          }
        }

        // 스트림 종료 후 남은 프레임 처리
        if (buffer.trim().length > 0) {
          processFrame(buffer);
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
