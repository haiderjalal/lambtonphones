import { MarkdownContent } from '@/components/shared/markdown-content';
import { PageHeader } from '@/components/shared/page-header';
import { Section } from '@/components/shared/section';
import { ROUTES } from '@/constants/routes';
import type { ContentPage } from '@/types/content';

interface ContentPageViewProps {
  page: ContentPage;
  eyebrow: string;
}

/** Renders an admin-managed page (about, privacy, terms) with the same header and reading width. */
export function ContentPageView({ page, eyebrow }: ContentPageViewProps) {
  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={page.title}
        description={page.meta_description || undefined}
        breadcrumbs={[{ label: 'Home', href: ROUTES.home }, { label: page.title }]}
      />
      <Section>
        <MarkdownContent source={page.body} />
      </Section>
    </>
  );
}
