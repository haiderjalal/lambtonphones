import { Gift, ScanSearch, ShieldCheck } from 'lucide-react';

import { Reveal } from '@/components/shared/reveal';
import { Section } from '@/components/shared/section';
import { SectionHeading } from '@/components/shared/section-heading';

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

      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {GUARANTEES.map(({ icon: Icon, title, description }, index) => (
          <li key={title}>
            <Reveal delayMs={index * 100} className="h-full">
              <article className="border-border bg-card h-full rounded-2xl border p-7 transition-shadow duration-300 hover:shadow-lg hover:shadow-slate-900/5">
                <span className="bg-primary text-primary-foreground shadow-primary/30 flex size-12 items-center justify-center rounded-xl shadow-md">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="text-brand-ink mt-6 text-lg font-semibold">{title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{description}</p>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
