import { Sparkles } from 'lucide-react';

interface TrustRibbonProps {
  items: string[];
}

/**
 * Scrolling ribbon of promises. The list is repeated so the loop is seamless. Duplicates are hidden
 * from assistive technology, and reduced-motion users get a static list through the CSS override.
 */
export function TrustRibbon({ items }: TrustRibbonProps) {
  if (items.length === 0) return null;

  const loop = [...items, ...items];

  return (
    <div
      className="border-border bg-background overflow-hidden border-y"
      role="region"
      aria-label="Our promises"
    >
      <ul className="animate-marquee flex w-max gap-12 py-4 hover:[animation-play-state:paused]">
        {loop.map((item, index) => (
          <li
            key={`${item}-${index}`}
            aria-hidden={index >= items.length ? true : undefined}
            className="text-brand-ink flex items-center gap-3 text-sm font-semibold whitespace-nowrap"
          >
            <Sparkles className="text-primary size-4" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
