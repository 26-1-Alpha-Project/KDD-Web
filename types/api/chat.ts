import type { ConfidenceLevel } from "@/types/chat";

export interface SourceRef {
  documentId: string;
  documentTitle: string;
  page: number;
}

export interface SSEMetaEvent {
  type: "meta";
  subtype: "document" | "cache" | "chitchat";
  confidence?: ConfidenceLevel;
  similarityScore?: number;
  sources?: SourceRef[];
}

export interface SSETextEvent {
  type: "text";
  content: string;
}

export interface SSEDoneEvent {
  type: "done";
  messageId: string;
}

export interface SSEFallbackEvent {
  type: "fallback";
  message: string;
  suggestedQuestions: string[];
}

export interface SSEErrorEvent {
  type: "error";
  message: string;
}

export type SSEEvent =
  | SSEMetaEvent
  | SSETextEvent
  | SSEDoneEvent
  | SSEFallbackEvent
  | SSEErrorEvent;

export interface ChatSession {
  sessionId: string;
  title: string;
  createdAt: string;
  lastMessageAt?: string;
}

export interface ChatMessage {
  messageId: string;
  role: "user" | "assistant";
  content: string;
  confidence?: ConfidenceLevel;
  sources?: SourceRef[];
  suggestedQuestions?: string[];
  createdAt: string;
}

export interface RecommendedQuestion {
  questionId: string;
  content: string;
}
