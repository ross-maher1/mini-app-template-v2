/**
 * Supabase Server Client
 * Use in Server Components, API routes, Server Actions
 *
 * Usage:
 *   import { createClient } from '@/lib/supabase/server';
 *   const supabase = await createClient();
 *
 * Admin client (bypasses RLS — server-side only):
 *   import { createAdminClient } from '@/lib/supabase/server';
 *   const supabase = await createAdminClient();
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getEnv } from "@/lib/env";

export async function createClient() {
  const cookieStore = await cookies();

  const env = getEnv();

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Ignore in Server Components
        }
      },
    },
  });
}

/**
 * Creates a Supabase admin client with service role key.
 * Only use this in server-side contexts where you need to bypass RLS.
 *
 * SECURITY WARNING: Never expose this client to the browser.
 * The service role key has full database access.
 */
export async function createAdminClient() {
  const env = getEnv();

  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. This is required for admin operations."
    );
  }

  const cookieStore = await cookies();

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Ignore in Server Components
        }
      },
    },
  });
}
