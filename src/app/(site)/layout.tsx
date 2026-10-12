import type { ReactNode } from 'react';

import { AnnouncementBar } from '@/components/layout/announcement-bar';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { getSiteSettings, getTopLevelServices } from '@/services/public-content-service';

/** Shared chrome for every public page. Settings and services are cached, so this costs little. */
export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [settings, services] = await Promise.all([getSiteSettings(), getTopLevelServices()]);

  return (
    <>
      <a
        href="#main"
        className="text-brand-ink sr-only z-50 rounded-lg bg-white px-4 py-2 text-sm font-semibold shadow-lg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to main content
      </a>

      {settings.announcement_active && settings.announcement_text ? (
        <AnnouncementBar text={settings.announcement_text} />
      ) : null}

      <SiteHeader settings={settings} services={services} />

      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>

      <SiteFooter settings={settings} services={services} />
    </>
  );
}
