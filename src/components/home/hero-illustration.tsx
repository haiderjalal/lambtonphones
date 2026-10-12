import Image from 'next/image';

import { TiltCard } from '@/components/shared/tilt-card';
import { HERO_BACKGROUND_IMAGE, HERO_PHONE_IMAGE } from '@/constants/site-images';

/**
 * Two overlapping photographs and a caption, arranged in depth. The group tilts toward the pointer,
 * the inset photo and caption sit in front of the large photo, and the caption floats. The large photo
 * drifts slowly as the page scrolls. The composition is decorative, so it is hidden from assistive
 * technology.
 */
export function HeroIllustration() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <TiltCard depth>
        <figure className="animate-clip-up bg-secondary relative aspect-[4/3] overflow-hidden rounded-lg lg:aspect-[4/5]">
          <Image
            src={HERO_BACKGROUND_IMAGE.src}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="scroll-drift object-cover"
          />
        </figure>

        <figure className="animate-fade-in border-background bg-card absolute -bottom-8 -left-4 aspect-square w-40 [transform:translateZ(70px)] overflow-hidden rounded-lg border-8 [animation-delay:500ms] sm:-left-8 sm:w-52 lg:-left-12 lg:w-60">
          <Image
            src={HERO_PHONE_IMAGE.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 240px, 208px"
            className="object-cover"
          />
        </figure>

        <div className="absolute top-5 right-5 [transform:translateZ(110px)] sm:top-8 sm:right-8">
          <div className="float-3d">
            <p className="animate-fade-up border-border bg-card/95 rounded-lg border px-4 py-3 text-xs leading-snug shadow-sm [animation-delay:700ms]">
              <span className="text-brand-ink block font-medium">Diagnosis first</span>
              <span className="text-muted-foreground block">Quote before any work starts</span>
            </p>
          </div>
        </div>
      </TiltCard>
    </div>
  );
}
