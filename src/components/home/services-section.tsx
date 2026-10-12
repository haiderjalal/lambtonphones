import { Section } from '@/components/shared/section';
import { SectionHeading } from '@/components/shared/section-heading';
import { Reveal } from '@/components/shared/reveal';
import { ServiceCard } from '@/components/services/service-card';
import type { ServiceWithChildren } from '@/types/content';

interface ServicesSectionProps {
  services: ServiceWithChildren[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <Section id="services" labelledBy="services-heading" tone="muted">
      <Reveal>
        <SectionHeading
          eyebrow="What we fix"
          titleId="services-heading"
          title="Repairs for the devices you rely on every day"
          description="From a cracked screen to a laptop that won't boot, our technicians diagnose the fault first, then explain the repair before any work starts."
        />
      </Reveal>

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service, index) => (
          <li key={service.id}>
            <Reveal delayMs={index * 80} className="h-full">
              <ServiceCard service={service} />
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
