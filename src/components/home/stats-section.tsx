import { AnimatedCounter } from '@/components/shared/animated-counter';
import { Container } from '@/components/shared/container';
import { Reveal } from '@/components/shared/reveal';

interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

// These figures mirror the published FAQ answers. Update them here if those answers change.
const STATS: readonly Stat[] = [
  { value: 90, suffix: ' days', label: 'Warranty on phone repairs' },
  { value: 30, suffix: ' min', label: 'Most repairs completed in under 30 minutes' },
  { value: 65, prefix: 'From $', label: 'Starting price for a repair' },
  { value: 7, suffix: ' days', label: 'Open every week, walk-ins welcome' },
];

export function StatsSection() {
  return (
    <section aria-label="Key facts" className="bg-brand-ink text-white">
      <Container className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-white/10 lg:grid-cols-4">
        {STATS.map((stat, index) => (
          <Reveal
            key={stat.label}
            delayMs={index * 90}
            className="bg-brand-ink-soft p-8 text-center sm:p-10"
          >
            <p className="text-brand-glow text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
              <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{stat.label}</p>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}
