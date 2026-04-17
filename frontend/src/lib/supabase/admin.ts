import { createClient } from '@supabase/supabase-js';

/**
 * Admin/service-role Supabase client.
 * NEVER use this in code sent to the browser.
 * Used only in scripts (seed) and secured server-side endpoints.
 */
export function getAdminSupabase() {
  const url = import.meta.env.PUBLIC_SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL;
  const key =
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase admin credentials missing');
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
