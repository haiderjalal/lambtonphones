import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { SERVICE_ICONS } from '@/constants/icons';
import { serviceHref } from '@/constants/routes';
import { SERVICE_IMAGES } from '@/constants/site-images';
import { cn } from '@/lib/utils';
import type { Service } from '@/types/content';

interface ServiceCardProps {
  service: Service;
  parentSlug?: string;
  className?: string;
}

/**
 * Card linking to a repair service. Top-level services show a photo; device pages fall back to the
 * icon. The icon, hover lift and arrow give feedback without JavaScript.
 */
export function ServiceCard({ service, parentSlug, className }: ServiceCardProps) {
  const Icon = SERVICE_ICONS[service.icon];
  const photo = SERVICE_IMAGES[service.slug];

  return (
    <Link
      href={serviceHref(service.slug, parentSlug)}
      className={cn(
        'group border-border bg-card hover:border-primary/40 hover:shadow-primary/10 relative flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
        className,
      )}
    >
      {photo ? (
        <div className="bg-secondary relative aspect-[4/3] overflow-hidden">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-6">
        <span
          className={cn(
            'bg-accent text-accent-foreground relative flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3',
            photo && 'ring-card -mt-10 ring-4',
          )}
        >
          <Icon className="size-6" aria-hidden="true" />
        </span>
        <h3 className="text-brand-ink mt-5 text-lg font-semibold">{service.name}</h3>
        <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">
          {service.summary}
        </p>
        <span className="text-primary mt-6 inline-flex items-center gap-1.5 text-sm font-semibold">
          Explore
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
