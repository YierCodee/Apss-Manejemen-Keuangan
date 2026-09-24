"use client";

import { useState } from "react";
import { Search, Mail, MailOpen, CheckCheck, X } from "lucide-react";
import { useMessages } from "@/features/pesan/hooks/useMessages";

const filterTabs = [
  { label: "Semua", value: "all" },
  { label: "Belum Dibaca", value: "unread" },
  { label: "Sudah Dibaca", value: "read" },
];

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Baru saja";
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export default function PesanPage() {
  const {
    messages,
    filteredMessages,
    unreadCount,
    filters,
    setFilters,
    markAsRead,
    markAllAsRead,
  } = useMessages();

  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedMessage = messages.find((m) => m.id === selectedMessageId);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setFilters((prev) => ({ ...prev, search: value || undefined }));
  };

  const handleFilterChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      readStatus: value as "all" | "read" | "unread",
    }));
  };

  const readCount = messages.length - unreadCount;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-5">
        <div className="flex flex-col gap-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <h1 className="text-xl font-bold leading-7 tracking-tight text-[#0f172a]">
                Pesan
              </h1>
              <p className="text-sm text-gray-500">
                Kotak masuk pesan dan notifikasi dari sistem
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm hover:bg-gray-50 transition-colors self-start"
              >
                <CheckCheck size={14} />
                Tandai Semua Dibaca
              </button>
            )}
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  TOTAL PESAN
                </span>
                <div className="flex size-7 items-center justify-center rounded-full bg-blue-50">
                  <Mail size={14} className="text-blue-600" />
                </div>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-[#0f172a]">
                {messages.length}
              </h2>
              <span className="text-xs text-gray-400">Semua pesan masuk</span>
            </div>

            <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  BELUM DIBACA
                </span>
                <div className="flex size-7 items-center justify-center rounded-full bg-red-50">
                  <Mail size={14} className="text-red-600" />
                </div>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-[#0f172a]">
                {unreadCount}
              </h2>
              <span className="text-xs text-gray-400">Pesan baru</span>
            </div>

            <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  SUDAH DIBACA
                </span>
                <div className="flex size-7 items-center justify-center rounded-full bg-emerald-50">
                  <MailOpen size={14} className="text-emerald-600" />
                </div>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-[#0f172a]">
                {readCount}
              </h2>
              <span className="text-xs text-gray-400">Pesan terbaca</span>
            </div>
          </div>

          {/* Message List */}
          <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 md:p-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-3">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-base font-bold text-[#0f172a]">
                  Kotak Masuk
                </h3>
                <p className="text-xs text-gray-400">
                  {filteredMessages.length} dari {messages.length} pesan
                </p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Cari pesan..."
                  className="h-9 w-full sm:w-56 rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20 focus:border-[#064e3b]"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto">
              {filterTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => handleFilterChange(tab.value)}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs transition-colors ${
                    (filters.readStatus || "all") === tab.value
                      ? "bg-[#064e3b] font-semibold text-white"
                      : "bg-gray-100 font-medium text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Messages */}
            {filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <Mail size={20} className="text-gray-400" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-gray-500">
                  Tidak ada pesan
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  Belum ada pesan yang masuk
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {filteredMessages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => {
                      markAsRead(msg.id);
                      setSelectedMessageId(msg.id);
                    }}
                    className={`flex items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-gray-50 ${
                      !msg.isRead ? "bg-blue-50/40" : ""
                    } ${
                      selectedMessageId === msg.id
                        ? "ring-1 ring-[#064e3b]/20 bg-[#064e3b]/5"
                        : ""
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        !msg.isRead
                          ? "bg-[#064e3b] text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {msg.senderAvatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-sm ${
                            !msg.isRead
                              ? "font-bold text-gray-900"
                              : "font-medium text-gray-600"
                          } truncate`}
                        >
                          {msg.senderName}
                        </p>
                        <span className="ml-auto flex-shrink-0 text-[11px] text-gray-400">
                          {formatRelativeTime(msg.timestamp)}
                        </span>
                      </div>
                      <p
                        className={`text-sm ${
                          !msg.isRead ? "font-semibold text-gray-800" : "text-gray-600"
                        } truncate`}
                      >
                        {msg.subject}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {msg.body}
                      </p>
                    </div>
                    {!msg.isRead && (
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setSelectedMessageId(null)}
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#064e3b] text-sm font-bold text-white">
                  {selectedMessage.senderAvatar}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {selectedMessage.senderName}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {formatRelativeTime(selectedMessage.timestamp)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMessageId(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-bold text-gray-900">
                {selectedMessage.subject}
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {selectedMessage.body}
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedMessageId(null)}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
