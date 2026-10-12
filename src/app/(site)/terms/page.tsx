import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ContentPageView } from '@/components/shared/content-page-view';
import { ROUTES } from '@/constants/routes';
import { buildPageMetadata } from '@/lib/seo';
import { getContentPage } from '@/services/public-content-service';

const PAGE_SLUG = 'terms';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContentPage(PAGE_SLUG);

  return buildPageMetadata({
    title: page?.title ?? 'Terms and Conditions',
    description:
      page?.meta_description ?? 'Terms for using this website and requesting repair quotes.',
    path: ROUTES.terms,
  });
}

export default async function TermsPage() {
  const page = await getContentPage(PAGE_SLUG);

  if (!page) notFound();

  return <ContentPageView page={page} eyebrow="Legal" />;
}
