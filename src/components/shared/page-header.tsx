import type { ReactNode } from 'react';

import { Container } from '@/components/shared/container';
import { Breadcrumbs, type BreadcrumbItem } from '@/components/shared/breadcrumbs';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  className?: string;
}

/** Dark hero band used at the top of inner pages. Keeps headings consistent across the site. */
export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn('bg-brand-ink relative overflow-hidden text-white', className)}>
      <div aria-hidden="true" className="surface-grid absolute inset-0 opacity-70" />
      <div
        aria-hidden="true"
        className="bg-primary/30 animate-glow absolute -top-24 right-0 size-[28rem] rounded-full blur-3xl"
      />
      <Container className="relative py-16 sm:py-20">
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} tone="dark" className="mb-6" /> : null}
        <div className="animate-fade-up max-w-3xl">
          {eyebrow ? (
            <p className="text-brand-glow text-sm font-semibold tracking-[0.18em] uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            {title}
          </h1>
          {description ? (
            <div className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              {description}
            </div>
          ) : null}
          {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </Container>
    </header>
  );
}
