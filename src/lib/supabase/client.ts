/**
 * Supabase Client - Browser / Client Component
 *
 * Gunakan file ini di:
 *  - React Client Components ("use client")
 *  - Browser-side code
 *  - Pages/components yang perlu akses Supabase dari sisi client
 *
 * Contoh penggunaan:
 *   import { supabase } from "@/lib/supabase/client";
 *   const { data, error } = await supabase.from("products").select("*");
 */
import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
