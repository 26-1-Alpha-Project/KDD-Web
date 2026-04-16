export type MessageRole = "user" | "assistant";

export type ConfidenceLevel = "high" | "medium" | "low";

export interface Source {
  documentId: number;
  documentTitle: string;
  page: number;
}

export interface ChatMessage {
  messageId: string;
  role: MessageRole;
  content: string;
  confidence?: ConfidenceLevel;
  sources?: Source[];
  suggestedQuestions?: string[];
  createdAt: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
}
