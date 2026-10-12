import type { FieldErrors } from '@/lib/validations/errors';

/** Shape returned by every server action, so forms can show one message and per-field errors. */
export type ActionResult<TData = undefined> =
  | { ok: true; message: string; data?: TData }
  | { ok: false; message: string; fieldErrors?: FieldErrors };
