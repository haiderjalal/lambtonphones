import type { ReactNode } from 'react';
import Image from 'next/image';

import { Container } from '@/components/shared/container';
import { Breadcrumbs, type BreadcrumbItem } from '@/components/shared/breadcrumbs';
import { cn } from '@/lib/utils';
import type { SiteImage } from '@/types/site-image';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  /** Optional background photo. The header stays readable without it. */
  image?: SiteImage;
  className?: string;
}

/** Dark hero band used at the top of inner pages. Keeps headings consistent across the site. */
export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  actions,
  image,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn('bg-brand-ink relative overflow-hidden text-white', className)}>
      {image ? (
        <>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="100vw"
            className="animate-ken-burns object-cover opacity-40"
          />
          <div
            aria-hidden="true"
            className="from-brand-ink via-brand-ink/85 to-brand-ink/60 absolute inset-0 bg-gradient-to-r"
          />
        </>
      ) : null}
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
