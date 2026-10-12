import { CalendarCheck, FileSearch, MessageSquareText } from 'lucide-react';

import Image from 'next/image';

import { LazyQuoteForm } from '@/components/forms/lazy-quote-form';
import { Reveal } from '@/components/shared/reveal';
import { Section } from '@/components/shared/section';
import { SectionHeading } from '@/components/shared/section-heading';
import { QUOTE_DESK_IMAGE } from '@/constants/site-images';

const STEPS = [
  {
    icon: MessageSquareText,
    title: 'Tell us what happened',
    text: 'Share your device, the problem and your contact details.',
  },
  {
    icon: FileSearch,
    title: 'Get a free assessment',
    text: 'We check the fault and send a clear, no-obligation quote.',
  },
  {
    icon: CalendarCheck,
    title: 'Drop in or book',
    text: 'Walk in, or pick a time. Most repairs take under 30 minutes.',
  },
] as const;

/** Homepage quote request. Lays out the three steps first so the form feels low-commitment. */
export function QuoteSection() {
  return (
    <Section id="quote" labelledBy="quote-heading">
      <div className="grid items-start gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <SectionHeading
            eyebrow="Free quote"
            titleId="quote-heading"
            title="Tell us what is wrong. We will do the rest."
            description="Send the details below and our team will come back with a clear, no-obligation quote."
          />
          <ol className="mt-10 grid gap-6">
            {STEPS.map(({ icon: Icon, title, text }, index) => (
              <li key={title}>
                <Reveal depth delayMs={index * 120} className="flex gap-4">
                  <span className="bg-accent text-accent-foreground flex size-11 shrink-0 items-center justify-center rounded-xl">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                      Step {index + 1}
                    </p>
                    <h3 className="text-brand-ink mt-1 font-semibold">{title}</h3>
                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
          <figure className="bg-secondary relative mt-12 aspect-[16/9] overflow-hidden rounded-lg">
            <Image
              src={QUOTE_DESK_IMAGE.src}
              alt={QUOTE_DESK_IMAGE.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="scroll-drift object-cover"
            />
          </figure>
        </Reveal>

        <Reveal depth delayMs={120} className="lg:col-span-7">
          <div className="border-border bg-card rounded-lg border p-6 sm:p-8">
            <LazyQuoteForm source="quote_form" defaultServiceType="Phone Repair" />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
