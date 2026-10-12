'use client';

import { Loader2, Save } from 'lucide-react';

import { FeedbackBanner } from '@/components/shared/feedback-banner';
import { Button } from '@/components/ui/button';
import type { FormFeedback } from '@/hooks/use-action-form';

interface FormActionsProps {
  isPending: boolean;
  feedback: FormFeedback | null;
  submitLabel?: string;
}

/** Feedback message plus the save button. Used at the foot of every admin form. */
export function FormActions({
  isPending,
  feedback,
  submitLabel = 'Save changes',
}: FormActionsProps) {
  return (
    <div className="border-border mt-8 grid gap-4 border-t pt-6">
      {feedback ? <FeedbackBanner tone={feedback.tone} message={feedback.message} /> : null}
      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isPending} className="min-w-44">
          {isPending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="size-4" aria-hidden="true" />
          )}
          {isPending ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </div>
  );
}
