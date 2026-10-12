import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CtaSection } from '@/components/home/cta-section';
import { ButtonLink } from '@/components/shared/button-link';
import { PageHeader } from '@/components/shared/page-header';
import { Section } from '@/components/shared/section';
import { HighlightList } from '@/components/services/highlight-list';
import { ROUTES, serviceHref } from '@/constants/routes';
import { buildPageMetadata } from '@/lib/seo';
import {
  getDevicePageParams,
  getDeviceServiceBySlugs,
  getSiteSettings,
} from '@/services/public-content-service';

interface DevicePageProps {
  params: Promise<{ service: string; device: string }>;
}

export async function generateStaticParams() {
  return getDevicePageParams();
}

export async function generateMetadata({ params }: DevicePageProps): Promise<Metadata> {
  const { service, device } = await params;
  const result = await getDeviceServiceBySlugs(service, device);

  if (!result) {
    return { title: 'Service not found', robots: { index: false, follow: false } };
  }

  return buildPageMetadata({
    title: `${result.device.name} in New Lambton`,
    description: result.device.summary,
    path: serviceHref(result.device.slug, result.parent.slug),
  });
}

export default async function DevicePage({ params }: DevicePageProps) {
  const { service, device } = await params;
  const [result, settings] = await Promise.all([
    getDeviceServiceBySlugs(service, device),
    getSiteSettings(),
  ]);

  if (!result) notFound();

  const { parent, device: deviceService } = result;

  return (
    <>
      <PageHeader
        eyebrow={parent.name}
        title={deviceService.name}
        description={deviceService.summary}
        breadcrumbs={[
          { label: 'Home', href: ROUTES.home },
          { label: 'Services', href: ROUTES.services },
          { label: parent.name, href: serviceHref(parent.slug) },
          { label: deviceService.name },
        ]}
        actions={
          <ButtonLink
            href={`${ROUTES.contact}?service=${parent.slug}`}
            size="lg"
            className="h-12 px-6"
          >
            Get a free quote
          </ButtonLink>
        }
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-foreground/90 text-lg leading-relaxed">
              {deviceService.description}
            </p>
            <h2 className="text-brand-ink mt-12 text-2xl font-bold tracking-tight">
              Common repairs
            </h2>
            <div className="mt-6">
              <HighlightList items={deviceService.highlights} />
            </div>
          </div>
          <aside className="lg:col-span-5">
            <div className="border-border bg-card sticky top-28 rounded-3xl border p-7 shadow-xl shadow-slate-900/5">
              <p className="text-primary text-sm font-semibold tracking-wider uppercase">
                Free diagnostics
              </p>
              <p className="text-foreground/90 mt-3 text-base leading-relaxed">
                We check the fault and quote the repair before any work starts. Walk-ins are
                welcome.
              </p>
              <ButtonLink
                href={`${ROUTES.contact}?service=${parent.slug}`}
                size="lg"
                className="mt-6 w-full"
              >
                Request a quote
              </ButtonLink>
              <p className="text-muted-foreground mt-4 text-center text-sm">
                or call{' '}
                <a
                  href={`tel:${settings.phone.replace(/\s/g, '')}`}
                  className="text-primary font-semibold"
                >
                  {settings.phone}
                </a>
              </p>
            </div>
          </aside>
        </div>
      </Section>

      <CtaSection settings={settings} />
    </>
  );
}
