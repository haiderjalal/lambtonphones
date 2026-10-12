import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';

import { databaseError } from '@/repositories/db-error';
import type { Database } from '@/types/database';

/**
 * Returns true when the signed-in user has a row in admin_users. Row level security only lets a
 * user read their own row, so this check cannot reveal the admin list.
 */
export async function isAdminUser(
  client: SupabaseClient<Database>,
  userId: string,
): Promise<boolean> {
  const { data, error } = await client
    .from('admin_users')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw databaseError(error, 'admin_users.check');

  return data !== null;
}
