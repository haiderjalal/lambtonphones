import Image from 'next/image';
import type { ReactNode } from 'react';

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
  /** Optional photo shown beside the title. The header reads well without it. */
  image?: SiteImage;
  className?: string;
}

/** Editorial page header used at the top of inner pages. Keeps headings consistent across the site. */
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
    <header className={cn('border-border border-b', className)}>
      <Container
        className={cn(
          'py-14 sm:py-20',
          image && 'grid items-center gap-12 lg:grid-cols-12 lg:gap-16',
        )}
      >
        <div className={cn(image && 'lg:col-span-7')}>
          {breadcrumbs ? <Breadcrumbs items={breadcrumbs} className="mb-8" /> : null}
          <div className="animate-fade-up">
            {eyebrow ? (
              <p className="text-muted-foreground flex items-center gap-3 text-xs font-medium tracking-[0.16em] uppercase">
                <span aria-hidden="true" className="bg-primary h-px w-8" />
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mt-5 text-4xl leading-[1.05] text-balance sm:text-5xl">{title}</h1>
            {description ? (
              <div className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">
                {description}
              </div>
            ) : null}
            {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
          </div>
        </div>

        {image ? (
          <div className="lg:col-span-5">
            <figure className="animate-clip-up bg-secondary relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="scroll-drift object-cover"
              />
            </figure>
          </div>
        ) : null}
      </Container>
    </header>
  );
}
