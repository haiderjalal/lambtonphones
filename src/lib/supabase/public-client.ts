import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { getPublicEnv } from '@/lib/env/public';
import type { Database } from '@/types/database';

let publicClient: SupabaseClient<Database> | undefined;

/**
 * Anonymous client for public content. It never reads request cookies, so the pages that use it
 * can be statically generated and cached. Row level security limits it to published rows.
 */
export function getPublicSupabaseClient(): SupabaseClient<Database> {
  if (!publicClient) {
    const env = getPublicEnv();

    publicClient = createClient<Database>(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      },
    );
  }

  return publicClient;
}
