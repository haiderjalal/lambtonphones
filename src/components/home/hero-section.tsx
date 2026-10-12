import { Phone, ShieldCheck, Timer, BadgeCheck } from 'lucide-react';

import { HeroIllustration } from '@/components/home/hero-illustration';
import { ButtonLink } from '@/components/shared/button-link';
import { Container } from '@/components/shared/container';
import { Button } from '@/components/ui/button';
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
    <section className="bg-brand-ink relative overflow-hidden text-white">
      <div
        aria-hidden="true"
        className="surface-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)] opacity-60"
      />
      <div
        aria-hidden="true"
        className="bg-primary/25 animate-glow absolute -top-40 -left-24 size-[32rem] rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="bg-brand-highlight/10 animate-glow absolute -right-24 bottom-0 size-[28rem] rounded-full blur-3xl [animation-delay:2s]"
      />

      <Container className="relative grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-7">
          <p className="animate-fade-up text-brand-glow inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold tracking-wide">
            <span className="relative flex size-2">
              <span className="bg-brand-glow absolute inline-flex size-full animate-ping rounded-full opacity-75" />
              <span className="bg-brand-glow relative inline-flex size-2 rounded-full" />
            </span>
            Based in {settings.suburb}, {settings.state} &middot; Walk-ins welcome
          </p>

          <h1 className="animate-fade-up mt-6 text-4xl leading-[1.1] font-bold tracking-tight text-balance [animation-delay:120ms] sm:text-5xl lg:text-6xl">
            {settings.hero_heading}
          </h1>

          <p className="animate-fade-up mt-6 max-w-xl text-lg leading-relaxed text-slate-300 [animation-delay:220ms]">
            {settings.hero_subheading}
          </p>

          <div className="animate-fade-up mt-10 flex flex-wrap gap-3 [animation-delay:320ms]">
            <ButtonLink
              href={ROUTES.contact}
              size="lg"
              className="shadow-primary/30 h-12 px-6 text-base shadow-lg"
            >
              Get a free quote
            </ButtonLink>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 border-white/20 bg-white/5 px-6 text-base text-white hover:bg-white/10 hover:text-white"
            >
              <a href={toTelHref(settings.phone)}>
                <Phone className="size-4" aria-hidden="true" />
                {settings.phone}
              </a>
            </Button>
          </div>

          <ul className="animate-fade-up mt-12 grid max-w-xl grid-cols-1 gap-3 [animation-delay:420ms] sm:grid-cols-3">
            {QUICK_FACTS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-3 text-sm font-medium text-slate-200"
              >
                <Icon className="text-brand-glow size-4" aria-hidden="true" />
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
