import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ContentPageView } from '@/components/shared/content-page-view';
import { ROUTES } from '@/constants/routes';
import { buildPageMetadata } from '@/lib/seo';
import { getContentPage } from '@/services/public-content-service';

const PAGE_SLUG = 'privacy';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContentPage(PAGE_SLUG);

  return buildPageMetadata({
    title: page?.title ?? 'Privacy Policy',
    description:
      page?.meta_description ?? 'How we collect, use and protect your personal information.',
    path: ROUTES.privacy,
  });
}

export default async function PrivacyPage() {
  const page = await getContentPage(PAGE_SLUG);

  if (!page) notFound();

  return <ContentPageView page={page} eyebrow="Legal" />;
}
