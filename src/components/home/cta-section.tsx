import Image from 'next/image';
import { Phone } from 'lucide-react';

import { ButtonLink } from '@/components/shared/button-link';
import { Container } from '@/components/shared/container';
import { Reveal } from '@/components/shared/reveal';
import { ROUTES } from '@/constants/routes';
import { CTA_BACKGROUND_IMAGE } from '@/constants/site-images';
import { toTelHref } from '@/utils/format';
import type { SiteSettings } from '@/types/content';

interface CtaSectionProps {
  settings: SiteSettings;
}

export function CtaSection({ settings }: CtaSectionProps) {
  return (
    <section
      aria-labelledby="cta-heading"
      className="bg-brand-ink relative overflow-hidden text-white"
    >
      <Image
        src={CTA_BACKGROUND_IMAGE.src}
        alt={CTA_BACKGROUND_IMAGE.alt}
        fill
        sizes="100vw"
        className="scroll-drift object-cover opacity-45"
      />
      <div
        aria-hidden="true"
        className="from-brand-ink via-brand-ink/80 to-brand-ink/60 absolute inset-0 bg-gradient-to-r"
      />

      <Container className="relative py-24 sm:py-32">
        <Reveal className="max-w-2xl">
          <p className="text-brand-glow flex items-center gap-3 text-xs font-medium tracking-[0.16em] uppercase">
            <span aria-hidden="true" className="bg-brand-glow h-px w-8" />
            Walk-ins welcome
          </p>
          <h2 id="cta-heading" className="mt-6 text-4xl leading-[1.05] text-balance sm:text-6xl">
            Bring the device in. We will tell you what it needs.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-300">
            {settings.street_address}, {settings.suburb}. Call first if you want to check
            availability.
          </p>
          <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <ButtonLink
              href={ROUTES.contact}
              size="lg"
              className="bg-brand-glow text-brand-ink hover:bg-brand-glow/90 h-12 px-7 text-base"
            >
              Book a repair
            </ButtonLink>
            <a
              href={toTelHref(settings.phone)}
              className="link-draw inline-flex items-center gap-2 text-base font-medium text-white"
            >
              <Phone className="size-4" aria-hidden="true" />
              {settings.phone}
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
