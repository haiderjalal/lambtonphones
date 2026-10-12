import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
}

/** Brand mark. Replace the SVG in this file with the official logo when it is supplied. */
export function Logo({ className, showTagline = true }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg viewBox="0 0 40 40" className="size-9 shrink-0" aria-hidden="true">
        <rect width="40" height="40" rx="11" className="fill-primary" />
        <rect
          x="13"
          y="9"
          width="14"
          height="22"
          rx="3.5"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.2"
        />
        <path d="M17.5 27h5" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
        <path
          d="M24.5 13.5l-3 4.5h3.5l-3 4.5"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="leading-tight">
        <span className="text-brand-ink block text-base font-normal">Lambton Phones</span>
        {showTagline ? (
          <span className="text-muted-foreground block text-[11px] font-semibold tracking-[0.18em] uppercase">
            &amp; Repairs
          </span>
        ) : null}
      </span>
    </span>
  );
}
