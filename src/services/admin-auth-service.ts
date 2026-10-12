import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { cache } from 'react';

import { ROUTES } from '@/constants/routes';
import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import { isAdminUser } from '@/repositories/admin-user-repository';
import type { Database } from '@/types/database';

export interface AdminContext {
  userId: string;
  email: string;
  client: SupabaseClient<Database>;
}

/**
 * Resolves the signed-in administrator for this request. React's cache() means pages, layouts
 * and actions in the same request share one lookup. Returns null for everyone else.
 */
export const getAdminContext = cache(async (): Promise<AdminContext | null> => {
  const client = await createSupabaseServerClient();
  const { data, error } = await client.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  const isAdmin = await isAdminUser(client, data.user.id);

  if (!isAdmin) {
    return null;
  }

  return { userId: data.user.id, email: data.user.email ?? '', client };
});

/** For admin pages. Anyone who is not an administrator is sent to the login screen. */
export async function requireAdminPage(): Promise<AdminContext> {
  const context = await getAdminContext();

  if (!context) {
    redirect(ROUTES.admin.login);
  }

  return context;
}
