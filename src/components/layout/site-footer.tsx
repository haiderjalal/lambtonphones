import Link from 'next/link';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';

import { Container } from '@/components/shared/container';
import { Logo } from '@/components/layout/logo';
import { FOOTER_LEGAL_LINKS, PRIMARY_NAV_LINKS } from '@/constants/navigation';
import { ROUTES, serviceHref } from '@/constants/routes';
import { toTelHref } from '@/utils/format';
import type { Service, SiteSettings } from '@/types/content';

interface SiteFooterProps {
  settings: SiteSettings;
  services: Service[];
}

const LINK_CLASS =
  'text-sm text-slate-300 transition-colors hover:text-white focus-visible:text-white';

export function SiteFooter({ settings, services }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const mapsUrl =
    settings.maps_url ??
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${settings.street_address} ${settings.suburb} ${settings.state} ${settings.postcode}`,
    )}`;

  return (
    <footer className="bg-brand-ink text-slate-300">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo className="[&_.text-brand-ink]:text-white [&_.text-muted-foreground]:text-slate-400" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">{settings.tagline}</p>
          <SocialLinks facebookUrl={settings.facebook_url} instagramUrl={settings.instagram_url} />
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold tracking-wider text-white uppercase">Repairs</h2>
          <ul className="mt-4 grid gap-2.5">
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={serviceHref(service.slug)} className={LINK_CLASS}>
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold tracking-wider text-white uppercase">Explore</h2>
          <ul className="mt-4 grid gap-2.5">
            {PRIMARY_NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={LINK_CLASS}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4">
          <h2 className="text-sm font-semibold tracking-wider text-white uppercase">Visit us</h2>
          <ul className="mt-4 grid gap-4 text-sm">
            <li className="flex gap-3">
              <MapPin className="text-brand-glow mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-white"
              >
                {settings.street_address}, {settings.suburb} {settings.state} {settings.postcode}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="text-brand-glow mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <a href={toTelHref(settings.phone)} className="transition-colors hover:text-white">
                {settings.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="text-brand-glow mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <a
                href={`mailto:${settings.email}`}
                className="break-all transition-colors hover:text-white"
              >
                {settings.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="text-brand-glow mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <ul className="grid gap-1">
                {settings.opening_hours.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-4 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {settings.business_name}. All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER_LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-white">
                {link.label}
              </Link>
            ))}
            <Link href={ROUTES.about} className="transition-colors hover:text-white">
              About this site
            </Link>
          </nav>
        </Container>
      </div>
    </footer>
  );
}

function SocialLinks({
  facebookUrl,
  instagramUrl,
}: {
  facebookUrl: string | null;
  instagramUrl: string | null;
}) {
  if (!facebookUrl && !instagramUrl) return null;

  return (
    <ul className="mt-6 flex gap-3">
      {facebookUrl ? (
        <li>
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:border-brand-glow flex size-10 items-center justify-center rounded-full border border-white/15 transition-all hover:-translate-y-0.5 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="size-4.5" fill="currentColor" aria-hidden="true">
              <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3V14h2.8v8h3.4Z" />
            </svg>
          </a>
        </li>
      ) : null}
      {instagramUrl ? (
        <li>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:border-brand-glow flex size-10 items-center justify-center rounded-full border border-white/15 transition-all hover:-translate-y-0.5 hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
            </svg>
          </a>
        </li>
      ) : null}
    </ul>
  );
}
