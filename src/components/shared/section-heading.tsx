import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  titleId?: string;
  description?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  titleId,
  description,
  align = 'left',
  tone = 'light',
  className,
}: SectionHeadingProps) {
  const isDark = tone === 'dark';

  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow ? (
        <p
          className={cn(
            'flex items-center gap-3 text-xs font-medium tracking-[0.16em] uppercase',
            align === 'center' && 'justify-center',
            isDark ? 'text-brand-glow' : 'text-muted-foreground',
          )}
        >
          <span
            aria-hidden="true"
            className={cn('h-px w-8', isDark ? 'bg-brand-glow' : 'bg-primary')}
          />
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={titleId}
        className={cn(
          'mt-5 text-4xl leading-[1.08] sm:text-5xl',
          isDark ? 'text-white' : 'text-brand-ink',
        )}
      >
        {title}
      </h2>
      {description ? (
        <div
          className={cn(
            'mt-5 text-base leading-relaxed sm:text-lg',
            isDark ? 'text-slate-300' : 'text-muted-foreground',
          )}
        >
          {description}
        </div>
      ) : null}
    </div>
  );
}
