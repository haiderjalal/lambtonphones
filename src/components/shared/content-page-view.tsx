import { MarkdownContent } from '@/components/shared/markdown-content';
import { PageHeader } from '@/components/shared/page-header';
import { Section } from '@/components/shared/section';
import { ROUTES } from '@/constants/routes';
import type { ContentPage } from '@/types/content';
import type { SiteImage } from '@/types/site-image';

interface ContentPageViewProps {
  page: ContentPage;
  eyebrow: string;
  image?: SiteImage;
}

/** Renders an admin-managed page (about, privacy, terms) with the same header and reading width. */
export function ContentPageView({ page, eyebrow, image }: ContentPageViewProps) {
  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={page.title}
        description={page.meta_description || undefined}
        breadcrumbs={[{ label: 'Home', href: ROUTES.home }, { label: page.title }]}
        image={image}
      />
      <Section>
        <MarkdownContent source={page.body} />
      </Section>
    </>
  );
}
