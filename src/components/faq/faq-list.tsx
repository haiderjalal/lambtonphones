import { ChevronDown } from 'lucide-react';

import type { Faq } from '@/types/content';

interface FaqListProps {
  items: Faq[];
}

/**
 * Accordion built on native <details>, so it works without JavaScript and is announced correctly
 * by assistive technology. Only the open state is styled, so no client code is needed.
 */
export function FaqList({ items }: FaqListProps) {
  return (
    <div className="divide-border border-border bg-card divide-y overflow-hidden rounded-lg border">
      {items.map((item) => (
        <details key={item.id} className="group open:bg-secondary/40">
          <summary className="text-brand-ink flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 text-left text-base font-semibold marker:content-none sm:px-7 [&::-webkit-details-marker]:hidden">
            {item.question}
            <ChevronDown
              className="text-primary size-5 shrink-0 transition-transform duration-300 group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <div className="text-muted-foreground animate-fade-in px-6 pb-6 text-sm leading-relaxed sm:px-7">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
