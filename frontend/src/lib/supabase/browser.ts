import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

/**
 * Browser-side Supabase client.
 * Uses localStorage for session persistence.
 * Used inside React islands running in the browser.
 */
let singleton: SupabaseClient | null = null;

export function getBrowserSupabase(): SupabaseClient {
  if (!singleton) {
    singleton = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'buho-auth',
      },
    });
  }
  return singleton;
}
