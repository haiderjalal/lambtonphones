'use client';

import { LogIn } from 'lucide-react';

import { signInAction } from '@/actions/auth-actions';
import { FormField } from '@/components/forms/form-field';
import { FeedbackBanner } from '@/components/shared/feedback-banner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useActionForm } from '@/hooks/use-action-form';
import { signInSchema, type SignInInput } from '@/lib/validations/auth';

const DEFAULT_VALUES: SignInInput = { email: '', password: '' };

export function LoginForm() {
  const { submit, isPending, feedback, form } = useActionForm({
    schema: signInSchema,
    defaultValues: DEFAULT_VALUES,
    action: signInAction,
  });

  const {
    formState: { errors },
    register,
  } = form;

  return (
    <form onSubmit={submit} noValidate className="grid gap-5">
      <FormField id="login-email" label="Email address" required error={errors.email?.message}>
        {(aria) => (
          <Input
            type="email"
            autoComplete="username"
            inputMode="email"
            {...aria}
            {...register('email')}
          />
        )}
      </FormField>

      <FormField id="login-password" label="Password" required error={errors.password?.message}>
        {(aria) => (
          <Input
            type="password"
            autoComplete="current-password"
            {...aria}
            {...register('password')}
          />
        )}
      </FormField>

      {feedback ? <FeedbackBanner tone={feedback.tone} message={feedback.message} /> : null}

      <Button type="submit" size="lg" disabled={isPending} className="mt-2">
        <LogIn className="size-4" aria-hidden="true" />
        {isPending ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}
