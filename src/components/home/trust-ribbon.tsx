interface TrustRibbonProps {
  items: string[];
}

/**
 * Scrolling strip of promises. The list is repeated so the loop is seamless. Duplicates are hidden
 * from assistive technology, and reduced-motion users get a static list through the CSS override.
 */
export function TrustRibbon({ items }: TrustRibbonProps) {
  if (items.length === 0) return null;

  const loop = [...items, ...items];

  return (
    <div
      className="border-border bg-card overflow-hidden border-y"
      role="region"
      aria-label="Our promises"
    >
      <ul className="animate-marquee flex w-max items-center gap-10 py-5 hover:[animation-play-state:paused]">
        {loop.map((item, index) => (
          <li
            key={`${item}-${index}`}
            aria-hidden={index >= items.length ? true : undefined}
            className="text-brand-ink flex items-center gap-10 text-sm font-medium whitespace-nowrap"
          >
            {item}
            <span aria-hidden="true" className="bg-primary/40 size-1.5 rounded-full" />
          </li>
        ))}
      </ul>
    </div>
  );
}
