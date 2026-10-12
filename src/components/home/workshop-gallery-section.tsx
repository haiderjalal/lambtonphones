import Image from 'next/image';

import { Reveal } from '@/components/shared/reveal';
import { Section } from '@/components/shared/section';
import { SectionHeading } from '@/components/shared/section-heading';

interface WorkshopPhoto {
  src: string;
  alt: string;
  caption: string;
  className?: string;
}

// The bento layout uses two column spans, so the large photo sits first and the wide photo last.
const WORKSHOP_PHOTOS: readonly WorkshopPhoto[] = [
  {
    src: '/images/workshop/soldering.webp',
    alt: 'Close-up of a soldering iron working on a circuit board',
    caption: 'Precision soldering',
    className: 'col-span-2 row-span-2',
  },
  {
    src: '/images/workshop/motherboard.webp',
    alt: 'Close-up of a green computer motherboard with chips and connectors',
    caption: 'Logic board inspection',
  },
  {
    src: '/images/workshop/cooling-board.webp',
    alt: 'Close-up of a laptop cooling fan beside a circuit board',
    caption: 'Cooling and airflow',
  },
  {
    src: '/images/workshop/technician-tools.webp',
    alt: 'Hands working on a device with pliers and tools beside a laptop',
    caption: 'Explained before we start',
    className: 'col-span-2',
  },
];

export function WorkshopGallerySection() {
  return (
    <Section labelledBy="workshop-heading">
      <Reveal>
        <SectionHeading
          eyebrow="Our process"
          titleId="workshop-heading"
          title="A closer look at how we repair"
          description="Every repair starts with a free diagnosis and a clear explanation before any work begins."
        />
      </Reveal>

      <ul className="mt-12 grid auto-rows-[200px] grid-cols-2 gap-4 lg:grid-cols-4">
        {WORKSHOP_PHOTOS.map((photo, index) => (
          <li key={photo.src} className={photo.className}>
            <Reveal delayMs={index * 90} className="h-full">
              <figure className="group bg-brand-ink relative h-full overflow-hidden rounded-lg">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div
                  aria-hidden="true"
                  className="from-brand-ink/90 via-brand-ink/20 absolute inset-0 bg-gradient-to-t to-transparent"
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 text-sm font-semibold text-white sm:text-base">
                  {photo.caption}
                </figcaption>
              </figure>
            </Reveal>
          </li>
        ))}
      </ul>

      <p className="text-muted-foreground mt-6 text-center text-xs">
        Stock photos shown for illustration.
      </p>
    </Section>
  );
}
