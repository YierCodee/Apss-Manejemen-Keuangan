export interface Message {
  id: string;
  senderName: string;
  senderAvatar: string;
  subject: string;
  body: string;
  timestamp: string;
  isRead: boolean;
}

export interface MessageFilters {
  search?: string;
  readStatus?: "all" | "read" | "unread";
}
