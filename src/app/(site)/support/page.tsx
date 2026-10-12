import { Phone, Mail } from 'lucide-react';

import { ButtonLink } from '@/components/shared/button-link';
import { PageHeader } from '@/components/shared/page-header';
import { Section } from '@/components/shared/section';
import { FaqList } from '@/components/faq/faq-list';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { buildPageMetadata } from '@/lib/seo';
import { getFaqs, getSiteSettings } from '@/services/public-content-service';
import { toTelHref } from '@/utils/format';

export const metadata = buildPageMetadata({
  title: 'Support and FAQs',
  description:
    'Answers to common questions about repair pricing, timing, warranty and payment at Lambton Phones & Repairs.',
  path: ROUTES.support,
});

export default async function SupportPage() {
  const [faqs, settings] = await Promise.all([getFaqs(), getSiteSettings()]);

  return (
    <>
      <PageHeader
        eyebrow="Support"
        title="Support and frequently asked questions"
        description="Quick answers about pricing, timing, warranty and payment. If your question is not here, we are happy to help."
        breadcrumbs={[{ label: 'Home', href: ROUTES.home }, { label: 'Support' }]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {faqs.length > 0 ? (
              <FaqList items={faqs} />
            ) : (
              <p className="text-muted-foreground">
                Our support answers are being updated. Please call us for help.
              </p>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="border-border bg-card sticky top-28 grid gap-5 rounded-3xl border p-7 shadow-xl shadow-slate-900/5">
              <p className="text-brand-ink text-lg font-semibold">Still need help?</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Call the shop during opening hours, email us, or send a message and we will reply.
              </p>
              <Button asChild variant="outline" className="justify-start">
                <a href={toTelHref(settings.phone)}>
                  <Phone className="size-4" aria-hidden="true" />
                  {settings.phone}
                </a>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <a href={`mailto:${settings.email}`} className="break-all">
                  <Mail className="size-4 shrink-0" aria-hidden="true" />
                  {settings.email}
                </a>
              </Button>
              <ButtonLink href={ROUTES.contact}>Send a message</ButtonLink>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
