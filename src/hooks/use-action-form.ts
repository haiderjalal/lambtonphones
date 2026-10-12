'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from 'react-hook-form';
import type { z } from 'zod';

import type { FieldErrors } from '@/lib/validations/errors';
import type { ActionResult } from '@/types/action-result';

export interface FormFeedback {
  tone: 'success' | 'error';
  message: string;
}

interface UseActionFormOptions<TValues extends FieldValues, TData> {
  /** Schema for the raw form input. The same schema is applied again on the server. */
  schema: z.ZodType<unknown, TValues>;
  defaultValues: DefaultValues<TValues>;
  action: (input: TValues) => Promise<ActionResult<TData>>;
  onSuccess?: (data: TData | undefined) => void;
}

/**
 * React Hook Form wired to a server action. The raw input is sent to the server, which validates
 * it again with the same schema, so client validation is a convenience and never the only check.
 */
export function useActionForm<TValues extends FieldValues, TData = undefined>({
  schema,
  defaultValues,
  action,
  onSuccess,
}: UseActionFormOptions<TValues, TData>) {
  const form = useForm<TValues>({
    resolver: zodResolver(schema, undefined, { raw: true }),
    defaultValues,
    mode: 'onTouched',
  });

  const [feedback, setFeedback] = useState<FormFeedback | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = form.handleSubmit((values) => {
    setFeedback(null);

    startTransition(async () => {
      const result = await action(values);

      if (result.ok) {
        setFeedback({ tone: 'success', message: result.message });
        onSuccess?.(result.data);
        return;
      }

      setFeedback({ tone: 'error', message: result.message });
      applyFieldErrors(form, result.fieldErrors);
    });
  });

  return { form, submit, isPending, feedback };
}

function applyFieldErrors<TValues extends FieldValues>(
  form: UseFormReturn<TValues>,
  fieldErrors: FieldErrors | undefined,
): void {
  if (!fieldErrors) return;

  for (const [name, messages] of Object.entries(fieldErrors)) {
    const [message] = messages;

    if (message && name !== 'form') {
      form.setError(name as Path<TValues>, { type: 'server', message });
    }
  }
}
