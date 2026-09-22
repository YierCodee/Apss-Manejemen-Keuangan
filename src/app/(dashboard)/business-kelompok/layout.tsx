import { Wrench } from "lucide-react";

export default function BusinessKelompokLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-[1280px] mx-auto space-y-6">
      <div className="border border-amber-200 bg-amber-50 rounded-xl p-5 flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100">
          <Wrench className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-amber-800">
            Fitur Dalam Pengembangan
          </h2>
          <p className="text-xs text-amber-600">
            Halaman ini masih dalam tahap pengembangan dan belum dapat
            digunakan. Fitur akan segera tersedia.
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
