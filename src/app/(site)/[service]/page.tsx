import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CtaSection } from '@/components/home/cta-section';
import { ButtonLink } from '@/components/shared/button-link';
import { PageHeader } from '@/components/shared/page-header';
import { Section } from '@/components/shared/section';
import { SectionHeading } from '@/components/shared/section-heading';
import { HighlightList } from '@/components/services/highlight-list';
import { ServiceCard } from '@/components/services/service-card';
import { ROUTES, serviceHref } from '@/constants/routes';
import { buildPageMetadata } from '@/lib/seo';
import {
  getServiceBySlug,
  getSiteSettings,
  getTopLevelServices,
} from '@/services/public-content-service';

interface ServicePageProps {
  params: Promise<{ service: string }>;
}

export async function generateStaticParams() {
  const services = await getTopLevelServices();

  return services.map((service) => ({ service: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { service: slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return { title: 'Service not found', robots: { index: false, follow: false } };
  }

  return buildPageMetadata({
    title: `${service.name} in New Lambton`,
    description: service.summary,
    path: serviceHref(service.slug),
  });
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { service: slug } = await params;
  const [service, settings] = await Promise.all([getServiceBySlug(slug), getSiteSettings()]);

  if (!service) notFound();

  const hasDevicePages = service.children.length > 0;

  return (
    <>
      <PageHeader
        eyebrow="Repair service"
        title={service.name}
        description={service.summary}
        breadcrumbs={[
          { label: 'Home', href: ROUTES.home },
          { label: 'Services', href: ROUTES.services },
          { label: service.name },
        ]}
        actions={
          <ButtonLink
            href={`${ROUTES.contact}?service=${service.slug}`}
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
            <p className="text-foreground/90 text-lg leading-relaxed">{service.description}</p>
            <h2 className="text-brand-ink mt-12 text-2xl font-bold tracking-tight">
              What we cover
            </h2>
            <div className="mt-6">
              <HighlightList items={service.highlights} />
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="border-border bg-card sticky top-28 rounded-3xl border p-7 shadow-xl shadow-slate-900/5">
              <p className="text-primary text-sm font-semibold tracking-wider uppercase">
                Before you visit
              </p>
              <p className="text-foreground/90 mt-3 text-base leading-relaxed">
                Walk-ins are welcome. Calling ahead helps us confirm parts and availability for your
                device.
              </p>
              <ButtonLink
                href={`${ROUTES.contact}?service=${service.slug}`}
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

      {hasDevicePages ? (
        <Section tone="muted" labelledBy="devices-heading">
          <SectionHeading
            eyebrow="Choose your device"
            titleId="devices-heading"
            title={`${service.name} by device`}
            description="Pick your device for more detail on the repairs we cover."
          />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {service.children.map((child) => (
              <li key={child.id}>
                <ServiceCard service={child} parentSlug={service.slug} className="h-full" />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <CtaSection settings={settings} />
    </>
  );
}
