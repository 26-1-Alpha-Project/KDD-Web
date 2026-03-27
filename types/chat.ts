export type MessageRole = "user" | "assistant";

export type ConfidenceLevel = "high" | "medium" | "low";

export interface Source {
  title: string;
  category: string;
  page: string;
  excerpt: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  confidence?: ConfidenceLevel;
  sources?: Source[];
  createdAt: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
}
