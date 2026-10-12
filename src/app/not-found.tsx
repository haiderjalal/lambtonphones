import { ArrowRight, Search } from 'lucide-react';

import { ButtonLink } from '@/components/shared/button-link';
import { Container } from '@/components/shared/container';
import { ROUTES } from '@/constants/routes';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Page not found',
  description: 'The page you were looking for could not be found.',
  path: '/404',
  noIndex: true,
});

export default function NotFound() {
  return (
    <main className="flex min-h-[70dvh] items-center py-24">
      <Container className="text-center">
        <p className="text-primary text-sm font-semibold tracking-[0.18em] uppercase">Error 404</p>
        <h1 className="text-brand-ink mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          We cannot find that page.
        </h1>
        <p className="text-muted-foreground mx-auto mt-5 max-w-lg text-lg">
          The link may be out of date, or the page may have moved. Try one of the options below.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href={ROUTES.home} size="lg">
            Back to the homepage
            <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href={ROUTES.shop} variant="outline" size="lg">
            <Search className="size-4" aria-hidden="true" />
            Browse accessories
          </ButtonLink>
        </div>
      </Container>
    </main>
  );
}
