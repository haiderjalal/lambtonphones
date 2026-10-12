import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { getPublicEnv } from '@/lib/env/public';
import { getServerEnv } from '@/lib/env/server';
import type { Database } from '@/types/database';

let serviceClient: SupabaseClient<Database> | undefined;

/**
 * Service-role client. It bypasses row level security, so it is limited to the enquiry insert,
 * which runs only after validation, honeypot and rate-limit checks.
 */
export function getServiceRoleSupabaseClient(): SupabaseClient<Database> {
  if (!serviceClient) {
    serviceClient = createClient<Database>(
      getPublicEnv().NEXT_PUBLIC_SUPABASE_URL,
      getServerEnv().SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      },
    );
  }

  return serviceClient;
}
