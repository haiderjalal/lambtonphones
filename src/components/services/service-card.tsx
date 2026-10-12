import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { SERVICE_ICONS } from '@/constants/icons';
import { serviceHref } from '@/constants/routes';
import { cn } from '@/lib/utils';
import type { Service } from '@/types/content';

interface ServiceCardProps {
  service: Service;
  parentSlug?: string;
  className?: string;
}

/** Card linking to a repair service. The icon, hover lift and arrow give feedback without JavaScript. */
export function ServiceCard({ service, parentSlug, className }: ServiceCardProps) {
  const Icon = SERVICE_ICONS[service.icon];

  return (
    <Link
      href={serviceHref(service.slug, parentSlug)}
      className={cn(
        'group border-border bg-card hover:border-primary/40 hover:shadow-primary/10 relative flex h-full flex-col rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
        className,
      )}
    >
      <span className="bg-accent text-accent-foreground flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <h3 className="text-brand-ink mt-5 text-lg font-semibold">{service.name}</h3>
      <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">{service.summary}</p>
      <span className="text-primary mt-6 inline-flex items-center gap-1.5 text-sm font-semibold">
        Explore
        <ArrowRight
          className="size-4 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}
