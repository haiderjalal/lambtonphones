'use server';

import { redirect } from 'next/navigation';

import { ROUTES } from '@/constants/routes';
import { logger } from '@/lib/logger';
import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import { signInSchema, type SignInInput } from '@/lib/validations/auth';
import { toFieldErrors } from '@/lib/validations/errors';
import { isAdminUser } from '@/repositories/admin-user-repository';
import type { ActionResult } from '@/types/action-result';

// Generic wording on purpose: the response must not reveal whether an account exists.
const INVALID_CREDENTIALS_MESSAGE = 'Email or password is incorrect.';
const NOT_ADMIN_MESSAGE = 'This account does not have admin access.';

export async function signInAction(input: SignInInput): Promise<ActionResult> {
  const parsed = signInSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: 'Please check the highlighted fields.',
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  const client = await createSupabaseServerClient();
  const { data, error } = await client.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    logger.warn('auth.sign_in_failed');
    return { ok: false, message: INVALID_CREDENTIALS_MESSAGE };
  }

  try {
    const isAdmin = await isAdminUser(client, data.user.id);

    if (!isAdmin) {
      await client.auth.signOut();
      logger.warn('auth.non_admin_sign_in_blocked');
      return { ok: false, message: NOT_ADMIN_MESSAGE };
    }
  } catch (adminCheckError) {
    logger.error('auth.admin_check_failed', adminCheckError);
    await client.auth.signOut();
    return { ok: false, message: 'We could not verify your access. Please try again.' };
  }

  logger.info('auth.sign_in_succeeded');
  redirect(ROUTES.admin.root);
}

export async function signOutAction(): Promise<void> {
  const client = await createSupabaseServerClient();
  const { error } = await client.auth.signOut();

  if (error) {
    logger.warn('auth.sign_out_failed');
  }

  redirect(ROUTES.admin.login);
}
