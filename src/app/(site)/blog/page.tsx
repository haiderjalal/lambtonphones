import { BookOpen } from 'lucide-react';

import { EmptyState } from '@/components/shared/empty-state';
import { PageHeader } from '@/components/shared/page-header';
import { Section } from '@/components/shared/section';
import { PostCard } from '@/components/blog/post-card';
import { ROUTES } from '@/constants/routes';
import { BLOG_BANNER_IMAGE } from '@/constants/site-images';
import { buildPageMetadata } from '@/lib/seo';
import { getBlogIndexData } from '@/services/public-content-service';

export const metadata = buildPageMetadata({
  title: 'Repair tips and guides',
  description:
    'Practical tips on looking after your phone, tablet and laptop, from the technicians at Lambton Phones & Repairs.',
  path: ROUTES.blog,
});

export default async function BlogPage() {
  const posts = await getBlogIndexData();

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Tips and guides for your devices"
        description="Simple advice on battery life, screen care, data backups and knowing when a repair is worth it."
        breadcrumbs={[{ label: 'Home', href: ROUTES.home }, { label: 'Blog' }]}
        image={BLOG_BANNER_IMAGE}
      />

      <Section>
        {posts.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="New articles are on the way"
            description="Our technicians are writing their first guides. Check back soon, or call us with any questions in the meantime."
          />
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
