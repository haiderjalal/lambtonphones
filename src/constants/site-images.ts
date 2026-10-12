import type { SiteImage } from '@/types/site-image';

// Static photos live in public/images and are credited in docs/media-credits.md.
// Accessory photos are not listed here: they are uploaded to Supabase Storage and linked from products.

export const HERO_BACKGROUND_IMAGE: SiteImage = {
  src: '/images/hero/repair-bench.webp',
  alt: '',
  width: 1920,
  height: 1080,
};

export const HERO_PHONE_IMAGE: SiteImage = {
  src: '/images/hero/parts-on-mat.webp',
  alt: '',
  width: 1200,
  height: 800,
};

export const CTA_BACKGROUND_IMAGE: SiteImage = {
  src: '/images/backgrounds/repair-tools.webp',
  alt: '',
  width: 1920,
  height: 1280,
};

export const ABOUT_BANNER_IMAGE: SiteImage = {
  src: '/images/pages/about-banner.webp',
  alt: '',
  width: 1600,
  height: 1067,
};

export const SHOP_BANNER_IMAGE: SiteImage = {
  src: '/images/pages/shop-banner.webp',
  alt: '',
  width: 1600,
  height: 1067,
};

/** Card photos for the top-level repair services, keyed by service slug. Other services use their icon. */
export const SERVICE_IMAGES: Readonly<Record<string, SiteImage | undefined>> = {
  'phone-repair': {
    src: '/images/services/phone-repair.webp',
    alt: '',
    width: 1000,
    height: 667,
  },
  'laptop-repair': {
    src: '/images/services/laptop-repair.webp',
    alt: '',
    width: 1000,
    height: 1333,
  },
  'tablet-repair': {
    src: '/images/services/tablet-repair.webp',
    alt: '',
    width: 1000,
    height: 1250,
  },
  'console-repair': {
    src: '/images/services/console-repair.webp',
    alt: '',
    width: 1000,
    height: 667,
  },
  'data-recovery': {
    src: '/images/services/data-recovery.webp',
    alt: '',
    width: 1000,
    height: 750,
  },
};
