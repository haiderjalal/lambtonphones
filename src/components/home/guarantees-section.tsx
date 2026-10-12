import { Gift, ScanSearch, ShieldCheck } from 'lucide-react';

import { Reveal } from '@/components/shared/reveal';
import { Section } from '@/components/shared/section';
import { SectionHeading } from '@/components/shared/section-heading';
import { TiltCard } from '@/components/shared/tilt-card';

const GUARANTEES = [
  {
    icon: ScanSearch,
    title: 'Free, no-risk assessment',
    description:
      'We diagnose the fault and quote the repair at no charge, so you can decide with no obligation.',
  },
  {
    icon: ShieldCheck,
    title: 'No fix, no fee',
    description: 'If we cannot resolve the problem, you do not pay for the repair.',
  },
  {
    icon: Gift,
    title: 'Complimentary charge port clean',
    description:
      'Many charging problems come from dust and lint in the port, and we clean it for free.',
  },
] as const;

export function GuaranteesSection() {
  return (
    <Section labelledBy="guarantees-heading">
      <Reveal>
        <SectionHeading
          eyebrow="Our promise"
          titleId="guarantees-heading"
          title="Honest service, backed by guarantees"
          description="Transparent quotes, genuine parts and a warranty you can rely on."
        />
      </Reveal>

      <ul className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
        {GUARANTEES.map(({ icon: Icon, title, description }, index) => (
          <li key={title}>
            <Reveal depth delayMs={index * 120} className="border-border h-full border-t pt-8">
              <TiltCard>
                <article>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-muted-foreground text-sm tabular-nums">
                      0{index + 1}
                    </span>
                    <Icon className="text-primary size-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-brand-ink font-display mt-8 text-2xl leading-tight font-normal">
                    {title}
                  </h3>
                  <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                    {description}
                  </p>
                </article>
              </TiltCard>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
