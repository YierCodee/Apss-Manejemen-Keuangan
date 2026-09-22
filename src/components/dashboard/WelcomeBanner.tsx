import Image from "next/image";

export function WelcomeBanner({ userName }: { userName: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d4a3a] via-[#13634F] to-[#1a7a5e] p-6 md:p-8 lg:p-10">
      {/* Decorative mesh gradient overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#2dd4a8]/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#0a9e7a]/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5eead4]/10 blur-2xl" />
      </div>

      {/* Subtle grain texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col-reverse items-center gap-6 sm:flex-col md:flex-row md:items-center md:justify-between md:gap-8">
        {/* Left: Greeting */}
        <div className="flex flex-col gap-2 text-center sm:text-left md:text-left">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5eead4]/80">
            Dashboard
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Hi, {userName}
          </h1>
          <p className="text-sm text-white/60 sm:text-base">
            Selamat datang di dashboard keuanganmu
          </p>
          <div className="mt-2 h-px w-12 bg-gradient-to-r from-[#5eead4]/60 to-transparent" />
        </div>

        {/* Right: Illustration */}
        <div className="relative flex-shrink-0">
          {/* Glow behind illustration */}
          <div className="absolute inset-0 scale-110 rounded-full bg-[#5eead4]/10 blur-2xl" />
          <Image
            src="/finance/welcome-illustration.svg"
            alt="Welcome illustration"
            width={180}
            height={140}
            className="relative w-[100px] sm:w-[120px] md:w-[160px] lg:w-[180px] h-auto"
            priority
          />
        </div>
      </div>

      {/* Decorative corner accent */}
      <div className="pointer-events-none absolute right-0 bottom-0 h-24 w-24 rounded-tl-full bg-white/5" />
    </div>
  );
}
