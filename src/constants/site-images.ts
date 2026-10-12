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

export const QUOTE_DESK_IMAGE: SiteImage = {
  src: '/images/home/quote-desk.webp',
  alt: '',
  width: 1600,
  height: 900,
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

export const SERVICES_BANNER_IMAGE: SiteImage = {
  src: '/images/pages/services-banner.webp',
  alt: '',
  width: 1600,
  height: 1067,
};

export const CONTACT_BANNER_IMAGE: SiteImage = {
  src: '/images/pages/contact-banner.webp',
  alt: '',
  width: 1600,
  height: 844,
};

export const SUPPORT_BANNER_IMAGE: SiteImage = {
  src: '/images/pages/support-banner.webp',
  alt: '',
  width: 1600,
  height: 1067,
};

export const BLOG_BANNER_IMAGE: SiteImage = {
  src: '/images/pages/blog-banner.webp',
  alt: '',
  width: 1600,
  height: 1067,
};

/**
 * Card photos for repair services, keyed by service slug. Top-level services and device pages both
 * use this map. Any service without an entry falls back to its icon.
 */
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
  'iphone-repair': {
    src: '/images/services/iphone-repair.webp',
    alt: '',
    width: 1000,
    height: 563,
  },
  'samsung-repair': {
    src: '/images/services/samsung-repair.webp',
    alt: '',
    width: 1000,
    height: 562,
  },
  'google-repair': {
    src: '/images/services/google-repair.webp',
    alt: '',
    width: 1000,
    height: 560,
  },
  'other-repair': {
    src: '/images/services/other-repair.webp',
    alt: '',
    width: 1000,
    height: 563,
  },
};
