import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { TiltCard } from '@/components/shared/tilt-card';
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
 * icon. The card tilts toward the pointer, and the photo zooms slowly on hover. Without JavaScript it
 * stays flat, and the link and hover zoom still work.
 */
export function ServiceCard({ service, parentSlug, className }: ServiceCardProps) {
  const Icon = SERVICE_ICONS[service.icon];
  const photo = SERVICE_IMAGES[service.slug];

  return (
    <TiltCard className={className}>
      <Link
        href={serviceHref(service.slug, parentSlug)}
        className="group border-border bg-card hover:border-brand-ink/30 relative flex h-full flex-col overflow-hidden rounded-lg border transition-colors duration-500"
      >
        {photo ? (
          <div className="bg-secondary relative aspect-[4/3] overflow-hidden">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
          </div>
        ) : null}

        <div className="flex flex-1 flex-col p-6">
          <span
            className={cn(
              'bg-accent text-accent-foreground relative z-10 flex size-10 items-center justify-center rounded-md',
              photo && 'ring-card -mt-12 ring-4',
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <h3 className="text-brand-ink mt-5 text-lg font-semibold">{service.name}</h3>
          <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">
            {service.summary}
          </p>
          <span className="text-brand-ink mt-6 inline-flex items-center gap-2 text-sm font-medium">
            <span className="link-draw">Explore this repair</span>
            <ArrowRight
              className="size-4 transition-transform duration-500 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    </TiltCard>
  );
}
