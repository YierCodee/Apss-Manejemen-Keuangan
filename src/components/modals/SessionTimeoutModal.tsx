"use client";

import { useSessionTimeoutContext } from "@/contexts/SessionTimeoutContext";

export function SessionTimeoutModal() {
  const { showWarning, timeLeft, extendSession, logout } =
    useSessionTimeoutContext();

  if (!showWarning) return null;

  // Format time as MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
          Sesi Anda Akan Berakhir
        </h2>

        {/* Description */}
        <p className="text-sm text-center text-gray-600 mb-4">
          Anda tidak aktif selama 18 menit. Sesi akan berakhir dalam:
        </p>

        {/* Countdown Timer */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 rounded-xl px-6 py-3">
            <span className="text-3xl font-bold text-gray-900 tabular-nums">
              {formattedTime}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
          >
            Logout
          </button>

          {/* Extend Session Button */}
          <button
            onClick={extendSession}
            className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
          >
            Perpanjang Sesi
          </button>
        </div>
      </div>
    </div>
  );
}
