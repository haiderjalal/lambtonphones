import type { ReactNode } from 'react';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/** Props a form control needs so that its label, error and hint are announced to assistive tech. */
export interface FieldControlProps {
  id: string;
  'aria-invalid': boolean;
  'aria-describedby': string | undefined;
}

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: (control: FieldControlProps) => ReactNode;
}

/**
 * Label, control, hint and error wired together. The render prop passes the control the ids and
 * ARIA attributes it needs, so the error text is linked to the input it describes.
 */
export function FormField({
  id,
  label,
  error,
  hint,
  required,
  className,
  children,
}: FormFieldProps) {
  const messageId = `${id}-message`;
  const message = error ?? hint;

  return (
    <div className={cn('grid gap-2', className)}>
      <Label htmlFor={id} className="text-brand-ink text-sm font-medium">
        {label}
        {required ? (
          <span className="text-destructive ml-1" aria-hidden="true">
            *
          </span>
        ) : null}
      </Label>

      {children({
        id,
        'aria-invalid': Boolean(error),
        'aria-describedby': message ? messageId : undefined,
      })}

      {message ? (
        <p
          id={messageId}
          className={cn(
            'text-sm',
            error ? 'text-destructive font-medium' : 'text-muted-foreground text-xs',
          )}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
