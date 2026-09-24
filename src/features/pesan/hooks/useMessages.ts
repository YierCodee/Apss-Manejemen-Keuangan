"use client";

import { useState, useCallback, useMemo } from "react";
import { mockMessages } from "../data/mockMessages";
import type { Message, MessageFilters } from "../types/message.types";

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [filters, setFilters] = useState<MessageFilters>({});

  const unreadCount = useMemo(
    () => messages.filter((m) => !m.isRead).length,
    [messages]
  );

  const filteredMessages = useMemo(() => {
    let result = [...messages];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (m) =>
          m.subject.toLowerCase().includes(q) ||
          m.senderName.toLowerCase().includes(q)
      );
    }

    if (filters.readStatus === "read") {
      result = result.filter((m) => m.isRead);
    } else if (filters.readStatus === "unread") {
      result = result.filter((m) => !m.isRead);
    }

    return result;
  }, [messages, filters]);

  const toggleRead = useCallback((id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: !m.isRead } : m))
    );
  }, []);

  const markAsRead = useCallback((id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
  }, []);

  return {
    messages,
    filteredMessages,
    unreadCount,
    filters,
    setFilters,
    toggleRead,
    markAsRead,
    markAllAsRead,
  };
}
