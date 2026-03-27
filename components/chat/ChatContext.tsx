"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { MOCK_CHAT_HISTORY } from "@/constants/mock";

interface ChatHistoryItem {
  id: string;
  title: string;
}

interface ChatContextValue {
  chatHistory: ChatHistoryItem[];
  addChat: (id: string, title: string) => void;
  deleteChat: (id: string) => void;
  renameChat: (id: string, newTitle: string) => void;
}

const ChatContext = createContext<ChatContextValue>({
  chatHistory: [],
  addChat: () => {},
  deleteChat: () => {},
  renameChat: () => {},
});

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([
    ...MOCK_CHAT_HISTORY,
  ]);

  const addChat = useCallback((id: string, title: string) => {
    setChatHistory((prev) => {
      if (prev.some((c) => c.id === id)) return prev;
      return [{ id, title }, ...prev];
    });
  }, []);

  const deleteChat = useCallback((id: string) => {
    setChatHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const renameChat = useCallback((id: string, newTitle: string) => {
    setChatHistory((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
    );
  }, []);

  return (
    <ChatContext.Provider
      value={{ chatHistory, addChat, deleteChat, renameChat }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  return useContext(ChatContext);
}
