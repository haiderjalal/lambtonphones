import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { ButtonLink } from '@/components/shared/button-link';
import { MarkdownContent } from '@/components/shared/markdown-content';
import { PageHeader } from '@/components/shared/page-header';
import { Section } from '@/components/shared/section';
import { ROUTES, blogPostHref } from '@/constants/routes';
import { buildPageMetadata } from '@/lib/seo';
import { getMediaUrl } from '@/lib/supabase/media';
import { getBlogPostData, getBlogPostParams } from '@/services/public-content-service';
import { formatDate } from '@/utils/format';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getBlogPostParams();
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostData(slug);

  if (!post) {
    return { title: 'Article not found', robots: { index: false, follow: false } };
  }

  return buildPageMetadata({
    title: post.title,
    description: post.excerpt || post.title,
    path: blogPostHref(post.slug),
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostData(slug);

  if (!post) notFound();

  const coverUrl = getMediaUrl(post.cover_image_path);

  return (
    <>
      <PageHeader
        eyebrow={post.published_at ? formatDate(post.published_at) : 'Article'}
        title={post.title}
        description={post.excerpt || undefined}
        breadcrumbs={[
          { label: 'Home', href: ROUTES.home },
          { label: 'Blog', href: ROUTES.blog },
          { label: post.title },
        ]}
      />

      <Section>
        {coverUrl ? (
          <div className="border-border relative mb-12 aspect-[16/9] overflow-hidden rounded-lg border">
            <Image
              src={coverUrl}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 768px, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}
        <MarkdownContent source={post.body} />

        <div className="border-border bg-card mt-16 flex flex-col items-start gap-4 rounded-lg border p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-brand-ink font-semibold">Need a repair? Our technicians can help.</p>
          <ButtonLink href={ROUTES.contact}>Get a free quote</ButtonLink>
        </div>
      </Section>
    </>
  );
}
