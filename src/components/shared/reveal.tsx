'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  /** Rises and tilts into place in 3D instead of fading in flat. */
  depth?: boolean;
}

/**
 * Fades content in once it scrolls into view. The hidden state comes from CSS, so the content is
 * visible in server HTML, with no JavaScript, and under reduced motion. The observer only adds a class.
 */
export function Reveal({ children, className, delayMs = 0, depth = false }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const markVisible = () => element.classList.add('is-visible');

    if (typeof IntersectionObserver === 'undefined') {
      markVisible();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          markVisible();
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(depth ? 'reveal-3d' : 'reveal', className)}
      style={{ '--reveal-delay': `${delayMs}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
