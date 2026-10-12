'use client';

import { RotateCcw, TriangleAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/shared/container';
import { ROUTES } from '@/constants/routes';
import { ButtonLink } from '@/components/shared/button-link';

interface ErrorPageProps {
  reset: () => void;
}

/**
 * Route-level error boundary. It never shows the underlying error, because internal details must
 * not reach visitors. The server log already records the failure.
 */
export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="flex min-h-[70dvh] items-center py-24">
      <Container className="text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-red-50 text-red-700">
          <TriangleAlert className="size-8" aria-hidden="true" />
        </span>
        <h1 className="text-brand-ink mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
          Something went wrong.
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-lg text-base">
          We could not load this page. Please try again in a moment. If the problem continues, call
          us and we will help you directly.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Try again
          </Button>
          <ButtonLink href={ROUTES.contact} variant="outline" size="lg">
            Contact the shop
          </ButtonLink>
        </div>
      </Container>
    </main>
  );
}
