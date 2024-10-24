import { Database } from "@/supabase/database-generated.types";
import { cookies } from 'next/headers';
import { CookieOptions, createServerClient } from '@supabase/ssr';

let supabaseServerClient: ReturnType<typeof createServerClient<Database>> | null = null;
let supabaseServiceClient: ReturnType<typeof createServerClient<Database>> | null = null;

// Helper to get the Supabase server-side client based on the key provided
export function getSupabaseServerClient() {
  if (!supabaseServerClient) {
    const cookieStore = cookies();

    supabaseServerClient = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: "", ...options });
          },
        },
      }
    );
  }
  return supabaseServerClient;
};

// Helper for service-key-based Supabase server client (used for admin tasks like deleting user)
export function getSupabaseServiceClient() {
  if (!supabaseServiceClient) {
    const cookieStore = cookies();

    supabaseServiceClient = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!,  // Using the service key here
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: "", ...options });
          },
        },
      }
    );
  }
  return supabaseServiceClient;
};
