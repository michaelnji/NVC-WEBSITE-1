import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { Database } from "../database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(supabaseUrl, supabaseAnon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", expires: new Date(0), ...options });
      },
    },
  });
}
