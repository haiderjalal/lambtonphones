import type { ReactNode } from 'react';

import { Container } from '@/components/shared/container';
import { cn } from '@/lib/utils';

type SectionTone = 'default' | 'muted' | 'dark';

const TONE_CLASSES: Record<SectionTone, string> = {
  default: 'bg-background text-foreground',
  muted: 'bg-secondary/60 text-foreground',
  dark: 'bg-brand-ink text-white',
};

interface SectionProps {
  id?: string;
  tone?: SectionTone;
  className?: string;
  containerClassName?: string;
  labelledBy?: string;
  children: ReactNode;
}

/** Standard page section: consistent vertical rhythm, a tone, and the shared content width. */
export function Section({
  id,
  tone = 'default',
  className,
  containerClassName,
  labelledBy,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn('py-16 sm:py-20 lg:py-24', TONE_CLASSES[tone], className)}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
