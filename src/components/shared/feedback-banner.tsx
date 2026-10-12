import { CircleAlert, CircleCheck } from 'lucide-react';

import { cn } from '@/lib/utils';

interface FeedbackBannerProps {
  tone: 'success' | 'error';
  message: string;
  className?: string;
}

/** Announces the outcome of a form submission. role="status" lets screen readers hear it. */
export function FeedbackBanner({ tone, message, className }: FeedbackBannerProps) {
  const isSuccess = tone === 'success';
  const Icon = isSuccess ? CircleCheck : CircleAlert;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'animate-fade-in flex items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-relaxed',
        isSuccess
          ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
          : 'border-red-200 bg-red-50 text-red-900',
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
