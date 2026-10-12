import { Phone } from 'lucide-react';

import { ButtonLink } from '@/components/shared/button-link';
import { Container } from '@/components/shared/container';
import { Reveal } from '@/components/shared/reveal';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { toTelHref } from '@/utils/format';
import type { SiteSettings } from '@/types/content';

interface CtaSectionProps {
  settings: SiteSettings;
}

export function CtaSection({ settings }: CtaSectionProps) {
  return (
    <section
      aria-labelledby="cta-heading"
      className="bg-brand-ink relative overflow-hidden py-20 text-white"
    >
      <div aria-hidden="true" className="surface-grid absolute inset-0 opacity-50" />
      <div
        aria-hidden="true"
        className="bg-primary/30 animate-glow absolute -bottom-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full blur-3xl"
      />

      <Container className="relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-brand-glow text-sm font-semibold tracking-[0.18em] uppercase">
            Expert repairs, walk-ins welcome
          </p>
          <h2
            id="cta-heading"
            className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
          >
            Get your device back in working order, today.
          </h2>
          <p className="mt-5 text-lg text-slate-300">
            Visit us at {settings.street_address}, {settings.suburb}, or call to check availability
            first.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink
              href={ROUTES.contact}
              size="lg"
              className="shadow-primary/30 h-12 px-7 text-base shadow-lg"
            >
              Book a repair
            </ButtonLink>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 border-white/20 bg-white/5 px-7 text-base text-white hover:bg-white/10 hover:text-white"
            >
              <a href={toTelHref(settings.phone)}>
                <Phone className="size-4" aria-hidden="true" />
                {settings.phone}
              </a>
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
