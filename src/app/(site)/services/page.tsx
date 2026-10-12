import { CtaSection } from '@/components/home/cta-section';
import { PageHeader } from '@/components/shared/page-header';
import { Section } from '@/components/shared/section';
import { ServiceCard } from '@/components/services/service-card';
import { ROUTES } from '@/constants/routes';
import { buildPageMetadata } from '@/lib/seo';
import { getSiteSettings, getTopLevelServices } from '@/services/public-content-service';

export const metadata = buildPageMetadata({
  title: 'Repair services',
  description:
    'Phone, tablet, laptop, console and data recovery repairs in New Lambton, Newcastle. Genuine parts and a warranty you can rely on.',
  path: ROUTES.services,
});

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getTopLevelServices(), getSiteSettings()]);

  return (
    <>
      <PageHeader
        eyebrow="Our services"
        title="Repairs for every device you rely on"
        description="Tell us what is wrong and we will diagnose it, explain the options and quote before any work begins."
        breadcrumbs={[{ label: 'Home', href: ROUTES.home }, { label: 'Services' }]}
      />
      <Section>
        {services.length === 0 ? (
          <p className="text-muted-foreground">
            Our repair services are being updated. Please call us for help.
          </p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <li key={service.id}>
                <ServiceCard service={service} className="h-full" />
              </li>
            ))}
          </ul>
        )}
      </Section>
      <CtaSection settings={settings} />
    </>
  );
}
