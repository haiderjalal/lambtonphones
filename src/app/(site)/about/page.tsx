import { notFound } from 'next/navigation';

import { ButtonLink } from '@/components/shared/button-link';
import { ContentPageView } from '@/components/shared/content-page-view';
import { Container } from '@/components/shared/container';
import { Section } from '@/components/shared/section';
import { CtaSection } from '@/components/home/cta-section';
import { ROUTES } from '@/constants/routes';
import { buildPageMetadata } from '@/lib/seo';
import { getContentPage, getSiteSettings } from '@/services/public-content-service';

const PAGE_SLUG = 'about';

export async function generateMetadata() {
  const page = await getContentPage(PAGE_SLUG);

  return buildPageMetadata({
    title: page?.title ?? 'About us',
    description: page?.meta_description ?? 'About Lambton Phones & Repairs.',
    path: ROUTES.about,
  });
}

export default async function AboutPage() {
  const [page, settings] = await Promise.all([getContentPage(PAGE_SLUG), getSiteSettings()]);

  if (!page) notFound();

  return (
    <>
      <ContentPageView page={page} eyebrow="About us" />
      <Section tone="muted">
        <Container className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-brand-ink text-lg font-semibold">Want to see the team in person?</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Walk-ins are welcome during opening hours.
            </p>
          </div>
          <ButtonLink href={ROUTES.contact} size="lg">
            Plan your visit
          </ButtonLink>
        </Container>
      </Section>
      <CtaSection settings={settings} />
    </>
  );
}
