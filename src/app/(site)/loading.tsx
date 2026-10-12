import { Container } from '@/components/shared/container';
import { Skeleton } from '@/components/ui/skeleton';

/** Shown while a public page streams in, so visitors see structure instead of a blank screen. */
export default function SiteLoading() {
  return (
    <div aria-busy="true" aria-live="polite" className="py-16">
      <Container className="grid gap-10">
        <div className="grid gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-full max-w-2xl" />
          <Skeleton className="h-5 w-full max-w-xl" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="border-border bg-card grid gap-4 rounded-lg border p-6">
              <Skeleton className="size-12 rounded-xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </Container>
      <span className="sr-only">Loading page content</span>
    </div>
  );
}
