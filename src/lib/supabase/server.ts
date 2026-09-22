/**
 * Supabase Client - Server Side
 *
 * Gunakan file ini di:
 *  - Server Components
 *  - Route Handlers (app/api/...)
 *  - Server Actions
 *
 * Contoh penggunaan di Server Component:
 *   import { createClient } from "@/lib/supabase/server";
 *   const supabase = await createClient();
 *   const { data, error } = await supabase.from("products").select("*");
 *
 * Contoh penggunaan di Route Handler:
 *   import { createClient } from "@/lib/supabase/server";
 *   export async function GET() {
 *     const supabase = await createClient();
 *     const { data, error } = await supabase.from("products").select("*");
 *     return Response.json({ data, error });
 *   }
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component — cookie tidak bisa di-set, abaikan.
            // Middleware/Route Handler tetap bisa mengakses cookie yang sudah ada.
          }
        },
      },
    }
  );
}
