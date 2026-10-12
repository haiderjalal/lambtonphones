'use client';

import { useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
}

const COUNT_EASING_POWER = 3;

/**
 * Counts up to the final value when the figure scrolls into view. The server renders the final
 * number, so the page stays correct without JavaScript. Reduced-motion users never see the animation.
 */
export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  durationMs = 1400,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const render = (current: number) => {
      element.textContent = `${prefix}${Math.round(current)}${suffix}`;
    };

    let frameId = 0;
    let startedAt: number | undefined;

    const step = (timestamp: number) => {
      startedAt ??= timestamp;
      const progress = Math.min((timestamp - startedAt) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, COUNT_EASING_POWER);

      render(value * eased);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    render(0);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          frameId = requestAnimationFrame(step);
        }
      },
      { threshold: 0.6 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [value, prefix, suffix, durationMs]);

  // The key remounts the span when the value changes, so React never edits text it no longer owns.
  return (
    <span key={value} ref={ref}>
      {`${prefix}${value}${suffix}`}
    </span>
  );
}
