import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

/** Shown whenever a list has no items, so visitors always know what to do next. */
export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="border-border bg-card flex flex-col items-center rounded-lg border border-dashed px-6 py-14 text-center">
      <span className="bg-accent text-accent-foreground flex size-14 items-center justify-center rounded-lg">
        <Icon className="size-7" aria-hidden="true" />
      </span>
      <h3 className="text-brand-ink mt-5 text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
