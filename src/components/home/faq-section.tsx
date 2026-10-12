import { ButtonLink } from '@/components/shared/button-link';
import { Reveal } from '@/components/shared/reveal';
import { Section } from '@/components/shared/section';
import { SectionHeading } from '@/components/shared/section-heading';
import { FaqList } from '@/components/faq/faq-list';
import { ROUTES } from '@/constants/routes';
import type { Faq } from '@/types/content';

interface FaqSectionProps {
  faqs: Faq[];
}

export function FaqSection({ faqs }: FaqSectionProps) {
  if (faqs.length === 0) return null;

  return (
    <Section labelledBy="faq-heading" tone="muted">
      <div className="grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <SectionHeading
            eyebrow="Good to know"
            titleId="faq-heading"
            title="Frequently asked questions"
            description="Quick answers about pricing, timing, warranty and payment. Can't find yours? Ask us directly."
          />
          <ButtonLink href={ROUTES.support} variant="outline" className="mt-8">
            Visit the support centre
          </ButtonLink>
        </Reveal>
        <Reveal delayMs={120} className="lg:col-span-7">
          <FaqList items={faqs} />
        </Reveal>
      </div>
    </Section>
  );
}
