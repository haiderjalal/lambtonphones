import Link from 'next/link';
import { ChevronDown, Clock, Mail, MapPin, Phone } from 'lucide-react';

import { ButtonLink } from '@/components/shared/button-link';
import { Container } from '@/components/shared/container';
import { Logo } from '@/components/layout/logo';
import { MobileNav } from '@/components/layout/mobile-nav';
import { PRIMARY_NAV_LINKS, type NavigationLink } from '@/constants/navigation';
import { ROUTES, serviceHref } from '@/constants/routes';
import { toTelHref } from '@/utils/format';
import type { Service, SiteSettings } from '@/types/content';

interface SiteHeaderProps {
  settings: SiteSettings;
  services: Service[];
}

const NAV_LINK_CLASS =
  'link-draw px-3 py-2 text-sm font-medium text-brand-ink/80 transition-colors hover:text-brand-ink focus-visible:text-brand-ink';

/** Site header: contact bar, logo, navigation and the quote call to action. Server-rendered. */
export function SiteHeader({ settings, services }: SiteHeaderProps) {
  const serviceLinks: NavigationLink[] = services.map((service) => ({
    label: service.name,
    href: serviceHref(service.slug),
  }));

  return (
    <header className="border-border bg-background sticky top-0 z-40 border-b">
      <div className="bg-brand-ink hidden text-slate-300 md:block">
        <Container className="flex h-10 items-center justify-between gap-6 text-xs">
          <div className="flex items-center gap-5">
            <a
              href={toTelHref(settings.phone)}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <Phone className="text-brand-glow size-3.5" aria-hidden="true" />
              {settings.phone}
            </a>
            <a
              href={`mailto:${settings.email}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <Mail className="text-brand-glow size-3.5" aria-hidden="true" />
              {settings.email}
            </a>
          </div>
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="text-brand-glow size-3.5" aria-hidden="true" />
              {settings.suburb}, {settings.state}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="text-brand-glow size-3.5" aria-hidden="true" />
              Walk-ins welcome
            </span>
          </div>
        </Container>
      </div>

      <Container className="flex h-18 items-center justify-between gap-4 py-3">
        <Link
          href={ROUTES.home}
          aria-label={`${settings.business_name}, home`}
          className="shrink-0 rounded-lg"
        >
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          <ServicesMenu links={serviceLinks} />
          {PRIMARY_NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={NAV_LINK_CLASS}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href={ROUTES.contact} size="lg" className="hidden sm:inline-flex">
            Get a free quote
          </ButtonLink>
          <MobileNav services={serviceLinks} phone={settings.phone} />
        </div>
      </Container>
    </header>
  );
}

function ServicesMenu({ links }: { links: NavigationLink[] }) {
  return (
    <div className="group relative">
      <Link href={ROUTES.services} className={`${NAV_LINK_CLASS} inline-flex items-center gap-1`}>
        Services
        <ChevronDown
          className="size-4 transition-transform duration-200 group-focus-within:rotate-180 group-hover:rotate-180"
          aria-hidden="true"
        />
      </Link>
      <div className="invisible absolute top-full left-0 z-50 pt-3 opacity-0 transition duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <ul className="border-border bg-popover w-72 rounded-lg border p-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-brand-ink hover:bg-secondary focus-visible:bg-secondary block rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="border-border mt-1 border-t pt-1">
            <Link
              href={ROUTES.services}
              className="text-primary hover:bg-accent block rounded-xl px-3.5 py-2.5 text-sm font-semibold"
            >
              View all services
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
