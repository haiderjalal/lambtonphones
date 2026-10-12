import 'server-only';

import { z } from 'zod';

import type { CacheTag } from '@/constants/cache';
import { invalidatePublicContent } from '@/lib/cache/invalidate';
import { logger } from '@/lib/logger';
import { toFieldErrors } from '@/lib/validations/errors';
import { getAdminContext, type AdminContext } from '@/services/admin-auth-service';
import type { ActionResult } from '@/types/action-result';

const VALIDATION_MESSAGE = 'Please check the highlighted fields and try again.';
const UNAUTHORISED_MESSAGE = 'Sign in as an administrator to make changes.';
const SAVE_FAILED_MESSAGE = 'We could not save your changes. Please try again.';
const MISSING_RECORD_MESSAGE = 'That record could not be found. Refresh the page and try again.';

const recordIdSchema = z.uuid().nullable();

/** Thrown by an action when a rule that the database cannot express is broken. Its message is shown to the admin. */
export class BusinessRuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BusinessRuleError';
  }
}

interface AdminMutationOptions<TSchema extends z.ZodType, TOutput> {
  /** Short name used in logs, for example "products.save". */
  name: string;
  schema: TSchema;
  input: unknown;
  /** The record being edited, or null when creating one. */
  recordId: string | null;
  successMessage: string;
  invalidates: readonly CacheTag[];
  execute: (
    values: z.output<TSchema>,
    admin: AdminContext,
    recordId: string | null,
  ) => Promise<TOutput>;
}

/**
 * Shared pipeline for every admin write: validate, authorise, persist, invalidate and log.
 * Keeping it in one place means no admin action can skip a step.
 */
export async function runAdminMutation<TSchema extends z.ZodType, TOutput>(
  options: AdminMutationOptions<TSchema, TOutput>,
): Promise<ActionResult<TOutput>> {
  const parsedRecordId = recordIdSchema.safeParse(options.recordId);

  if (!parsedRecordId.success) {
    return { ok: false, message: MISSING_RECORD_MESSAGE };
  }

  const parsed = options.schema.safeParse(options.input);

  if (!parsed.success) {
    return { ok: false, message: VALIDATION_MESSAGE, fieldErrors: toFieldErrors(parsed.error) };
  }

  const admin = await getAdminContext();

  if (!admin) {
    return { ok: false, message: UNAUTHORISED_MESSAGE };
  }

  try {
    const data = await options.execute(parsed.data, admin, parsedRecordId.data);

    invalidatePublicContent(options.invalidates);
    logger.info('admin.mutation.succeeded', { name: options.name });

    return { ok: true, message: options.successMessage, data };
  } catch (error) {
    if (error instanceof BusinessRuleError) {
      return { ok: false, message: error.message };
    }

    logger.error('admin.mutation.failed', error, { name: options.name });

    return { ok: false, message: SAVE_FAILED_MESSAGE };
  }
}
