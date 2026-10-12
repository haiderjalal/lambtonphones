import { CircleCheck } from 'lucide-react';

interface HighlightListProps {
  items: string[];
  className?: string;
}

/** Bulleted checklist of what a service covers. */
export function HighlightList({ items, className }: HighlightListProps) {
  if (items.length === 0) return null;

  return (
    <ul className={className ?? 'grid gap-3 sm:grid-cols-2'}>
      {items.map((item) => (
        <li
          key={item}
          className="border-border bg-card text-brand-ink flex items-start gap-3 rounded-xl border px-4 py-3.5 text-sm font-medium"
        >
          <CircleCheck className="text-primary mt-0.5 size-4.5 shrink-0" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}
