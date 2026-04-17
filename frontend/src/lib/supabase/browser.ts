import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

/**
 * Browser-side Supabase client.
 * Uses COOKIES (via @supabase/ssr) so the SSR middleware on /admin can
 * read the same session on subsequent requests.
 */
let singleton: SupabaseClient | null = null;

export function getBrowserSupabase(): SupabaseClient {
  if (!singleton) {
    singleton = createBrowserClient(url, anonKey);
  }
  return singleton;
}
