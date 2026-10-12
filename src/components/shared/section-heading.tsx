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
            'text-sm font-semibold tracking-[0.18em] uppercase',
            isDark ? 'text-brand-glow' : 'text-primary',
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={titleId}
        className={cn(
          'mt-3 text-3xl font-bold tracking-tight sm:text-4xl',
          isDark ? 'text-white' : 'text-brand-ink',
        )}
      >
        {title}
      </h2>
      {description ? (
        <div
          className={cn(
            'mt-4 text-base leading-relaxed sm:text-lg',
            isDark ? 'text-slate-300' : 'text-muted-foreground',
          )}
        >
          {description}
        </div>
      ) : null}
    </div>
  );
}
