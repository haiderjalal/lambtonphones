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
      <Container>
        <div className="grid grid-cols-2 gap-px border-y border-white/10 bg-white/10 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <Reveal
              key={stat.label}
              delayMs={index * 110}
              className="bg-brand-ink px-5 py-12 sm:px-8 lg:py-16"
            >
              <p className="text-brand-glow font-display text-5xl leading-none whitespace-nowrap tabular-nums">
                <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </p>
              <p className="mt-4 max-w-[15rem] text-sm leading-relaxed text-slate-400">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
