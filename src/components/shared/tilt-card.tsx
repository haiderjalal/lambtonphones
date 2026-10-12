'use client';

import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Keeps children in 3D space, so elements with translateZ float above the card. */
  depth?: boolean;
}

/**
 * Turns its content toward the mouse pointer and adds a soft glare that follows it. Tilt only runs
 * for mouse pointers, and not when the user has asked for reduced motion. Touch screens and
 * keyboards get the flat card, and so does a page without JavaScript.
 */
export function TiltCard({ children, className, depth = false }: TiltCardProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const frameId = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frameId.current), []);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const frame = frameRef.current;

    if (!frame || event.pointerType !== 'mouse') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = frame.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    // One update per frame keeps pointer moves cheap, however fast the mouse moves.
    cancelAnimationFrame(frameId.current);
    frameId.current = requestAnimationFrame(() => {
      frame.classList.add('is-tilting');
      frame.style.setProperty('--tilt-x', (x * 2 - 1).toFixed(3));
      frame.style.setProperty('--tilt-y', (y * 2 - 1).toFixed(3));
      frame.style.setProperty('--glare-x', `${(x * 100).toFixed(1)}%`);
      frame.style.setProperty('--glare-y', `${(y * 100).toFixed(1)}%`);
    });
  }

  function resetTilt() {
    const frame = frameRef.current;

    cancelAnimationFrame(frameId.current);
    if (!frame) return;

    frame.classList.remove('is-tilting');
    frame.style.setProperty('--tilt-x', '0');
    frame.style.setProperty('--tilt-y', '0');
  }

  return (
    <div className="tilt-stage h-full">
      <div
        ref={frameRef}
        className={cn('tilt-frame h-full', depth && 'tilt-depth', className)}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
      >
        {children}
        <span aria-hidden="true" className="tilt-glare" />
      </div>
    </div>
  );
}
