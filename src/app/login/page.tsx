"use client";

import { useState } from "react";
import Link from "next/link";
import FinaroLogo from "@/components/shared/FinaroLogo";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};

    if (!email.trim()) {
      errs.email = "Email harus diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Format email tidak valid";
    }

    if (!password) {
      errs.password = "Kata sandi harus diisi";
    } else if (password.length < 8) {
      errs.password = "Kata sandi minimal 8 karakter";
    }

    return errs;
  }

  function clearError(field: string) {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (serverError) setServerError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          rememberMe,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Terjadi kesalahan, silakan coba lagi");
        return;
      }

      // Login successful — redirect
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get("redirect") || "/dashboard";
      window.location.href = redirectTo;
    } catch {
      setServerError("Terjadi kesalahan, silakan coba lagi");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 antialiased flex flex-col justify-between">
      <main className="min-h-screen flex flex-col lg:flex-row w-full">
        {/* Left Brand Panel */}
        <section className="hidden lg:flex lg:w-[48%] xl:w-[45%] bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white relative overflow-hidden p-12 xl:p-16 flex-col justify-between">
          {/* Background pattern & glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/4 -right-24 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Middle: Value Proposition & Preview Card */}
          <div className="relative z-10 my-auto py-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-semibold mb-6 border border-white/10">
              <svg
                className="w-3.5 h-3.5 text-emerald-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Sistem Keuangan Terintegrasi &amp; Aman
            </div>
            <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight mb-4">
              Kelola keuangan bisnis &amp; pribadi dalam satu portal cerdas.
            </h1>
            <p className="text-slate-300 text-base xl:text-lg leading-relaxed mb-10 max-w-lg">
              Pantau arus kas, verifikasi anggaran RAB, hingga otomatisasi
              standing orders secara real-time dengan proteksi standar
              perbankan.
            </p>

            {/* Preview Mock Balance Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-6 shadow-2xl max-w-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-emerald-200 font-semibold">
                  Total Saldo Aktif
                </span>
                <span className="text-xs text-white/70 bg-white/10 px-2 py-0.5 rounded">
                  Hubungkan Rekening
                </span>
              </div>
              <div className="text-3xl font-extrabold tracking-tight text-white mb-3">
                Rp 68.789,56
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-200/90 mb-5">
                <span>
                  &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull;
                  &bull;&bull;&bull;&bull; 4821
                </span>
                <svg
                  className="w-4 h-4 text-emerald-300 inline"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                  <path
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-slate-200 font-medium">
                    Standing Order Otomatis
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  Aktif
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Trust Info */}
          <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              <span>Enkripsi 256-Bit Bank-Grade Security</span>
            </div>
            <div className="text-slate-400">ISO/IEC 27001 Terverifikasi</div>
          </div>
        </section>

        {/* Right Form Panel */}
        <section className="flex-1 flex flex-col justify-between bg-[#F8FAFC] p-6 sm:p-10 lg:p-14 overflow-y-auto">
          {/* Top Bar: Mobile Logo + Language Switcher */}
          <header className="w-full flex items-center justify-between pb-6 sm:pb-8">
            {/* Mobile brand logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <FinaroLogo height={28} />
              <h1 className="text-xl font-bold text-primary">Finaro</h1>
            </div>
            <div className="hidden lg:block" />

            {/* Language Selector */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm text-xs font-semibold text-slate-700 hover:border-slate-300 cursor-pointer transition-colors">
              <svg
                className="w-4 h-4 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              <span className="font-bold text-emerald-800">ID</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 hover:text-slate-800">EN</span>
            </div>
          </header>

          {/* Center Form Container */}
          <div className="w-full max-w-md mx-auto my-auto py-4">
            {/* Form Header */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
                Selamat Datang Kembali
              </h2>
              <p className="text-sm text-slate-600">
                Akses portal finansial dan kelola transaksi bisnis Anda dengan
                mudah.
              </p>
            </div>

            {/* Server Error Banner */}
            {serverError && (
              <div className="mb-5 rounded-xl bg-red-50 border border-red-200 p-3 flex items-start gap-2.5">
                <svg
                  className="w-4 h-4 text-red-500 mt-0.5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-xs text-red-700 font-medium">
                  {serverError}
                </p>
              </div>
            )}

            {/* Login Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email / User ID */}
              <div>
                <label
                  htmlFor="identifier"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Email atau ID Pengguna
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center">
                    <svg
                      className="h-5 w-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="identifier"
                    name="identifier"
                    placeholder="nama@finaro.id"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearError("email");
                    }}
                    className="block w-full rounded-xl border-slate-200 pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/20 bg-white transition-all shadow-sm"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                  >
                    Kata Sandi
                  </label>
                  <a
                    href="#"
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 transition-colors"
                  >
                    Lupa Kata Sandi?
                  </a>
                </div>
                <div className="relative rounded-xl shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center">
                    <svg
                      className="h-5 w-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="••••••••••••"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearError("password");
                    }}
                    className="block w-full rounded-xl border-slate-200 pl-11 pr-11 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/20 bg-white transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                      <path
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-800 focus:ring-emerald-800/30 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-600 select-none">
                    Ingat perangkat ini selama 30 hari
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Finaro</span>
                    <svg
                      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#F8FAFC] px-3 font-semibold text-slate-400 tracking-wider">
                  Atau masuk dengan
                </span>
              </div>
            </div>

            {/* SSO Options */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center items-center gap-2.5 py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Google</span>
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm transition-colors"
              >
                <svg
                  className="w-4 h-4 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                <span>Corporate SSO</span>
              </button>
            </div>

            {/* Registration Link */}
            <div className="mt-8 text-center">
              <p className="text-xs text-slate-500 font-medium">
                Belum memiliki akun Finaro?
                <Link
                  href="/register"
                  className="text-emerald-800 font-bold hover:underline ml-1"
                >
                  Daftar Sekarang
                </Link>
              </p>
            </div>
          </div>

          {/* Footer Copyright & Terms */}
          <footer className="w-full pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <p>&copy; 2024 Finaro. Hak Cipta Dilindungi.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-slate-600 transition-colors">
                Ketentuan Layanan
              </a>
              <a href="#" className="hover:text-slate-600 transition-colors">
                Kebijakan Privasi
              </a>
              <a href="#" className="hover:text-slate-600 transition-colors">
                Bantuan 24/7
              </a>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
