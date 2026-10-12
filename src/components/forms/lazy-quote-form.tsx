'use client';

import { lazy, Suspense, useEffect, useRef, useState, type ComponentProps } from 'react';

import type { QuoteForm } from '@/components/forms/quote-form';

// The form and its validation code are only downloaded once the form is about to scroll into view.
const LoadedQuoteForm = lazy(() =>
  import('@/components/forms/quote-form').then((module) => ({ default: module.QuoteForm })),
);

// Reserves the form's height, so the page does not jump when the form arrives.
const RESERVED_HEIGHT_CLASS = 'min-h-[36rem]';

type LazyQuoteFormProps = ComponentProps<typeof QuoteForm>;

/**
 * Loads the enquiry form on demand. Visitors who never reach the form never download its code, which
 * keeps the first page load lighter. The server still renders the page without the form's code.
 */
export function LazyQuoteForm(props: LazyQuoteFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const element = containerRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '600px 0px' },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={RESERVED_HEIGHT_CLASS}>
      {isNearViewport ? (
        <Suspense fallback={null}>
          <LoadedQuoteForm {...props} />
        </Suspense>
      ) : null}
    </div>
  );
}
