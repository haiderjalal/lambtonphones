import { BadgeCheck, Phone, ShieldCheck, Timer } from 'lucide-react';

import { HeroIllustration } from '@/components/home/hero-illustration';
import { ButtonLink } from '@/components/shared/button-link';
import { Container } from '@/components/shared/container';
import { SplitWords } from '@/components/shared/split-words';
import { ROUTES } from '@/constants/routes';
import { toTelHref } from '@/utils/format';
import type { SiteSettings } from '@/types/content';

const QUICK_FACTS = [
  { icon: Timer, label: 'Same-day service' },
  { icon: BadgeCheck, label: 'Genuine parts' },
  { icon: ShieldCheck, label: 'No fix, no fee' },
] as const;

interface HeroSectionProps {
  settings: SiteSettings;
}

export function HeroSection({ settings }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      <Container className="grid items-center gap-14 pt-14 pb-20 sm:pt-20 lg:grid-cols-12 lg:gap-16 lg:pt-24 lg:pb-28">
        <div className="lg:col-span-7">
          <p className="animate-fade-in text-muted-foreground flex items-center gap-3 text-xs font-medium tracking-[0.16em] uppercase">
            <span aria-hidden="true" className="bg-primary h-px w-8" />
            {settings.suburb}, {settings.state} &middot; Walk-ins welcome
          </p>

          <h1 className="mt-7 text-5xl leading-[1.02] sm:text-6xl lg:text-[4.5rem]">
            <SplitWords text={settings.hero_heading} startDelayMs={120} />
          </h1>

          <p className="animate-fade-up text-muted-foreground mt-7 max-w-lg text-lg leading-relaxed [animation-delay:650ms]">
            {settings.hero_subheading}
          </p>

          <div className="animate-fade-up mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 [animation-delay:800ms]">
            <ButtonLink href={ROUTES.contact} size="lg" className="h-12 px-7 text-base">
              Get a free quote
            </ButtonLink>
            <a
              href={toTelHref(settings.phone)}
              className="text-brand-ink link-draw inline-flex items-center gap-2 text-base font-medium"
            >
              <Phone className="size-4" aria-hidden="true" />
              {settings.phone}
            </a>
          </div>

          <ul className="animate-fade-up border-border mt-14 grid grid-cols-1 divide-y border-y [animation-delay:950ms] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {QUICK_FACTS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="text-brand-ink flex items-center gap-3 py-4 text-sm font-medium sm:px-5 sm:first:pl-0"
              >
                <Icon className="text-primary size-4 shrink-0" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <HeroIllustration />
        </div>
      </Container>
    </section>
  );
}
