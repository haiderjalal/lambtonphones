import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  ABOUT_BANNER_IMAGE,
  CTA_BACKGROUND_IMAGE,
  HERO_BACKGROUND_IMAGE,
  HERO_PHONE_IMAGE,
  SERVICE_IMAGES,
  SHOP_BANNER_IMAGE,
} from '@/constants/site-images';
import type { SiteImage } from '@/types/site-image';

const PUBLIC_DIR = join(process.cwd(), 'public');

const STATIC_IMAGES: SiteImage[] = [
  HERO_BACKGROUND_IMAGE,
  HERO_PHONE_IMAGE,
  CTA_BACKGROUND_IMAGE,
  ABOUT_BANNER_IMAGE,
  SHOP_BANNER_IMAGE,
  ...Object.values(SERVICE_IMAGES).filter((image): image is SiteImage => image !== undefined),
];

describe('static site images', () => {
  it.each(STATIC_IMAGES)('$src is a WebP file that exists in public/', (image) => {
    expect(image.src).toMatch(/^\/images\/.+\.webp$/);
    expect(existsSync(join(PUBLIC_DIR, image.src))).toBe(true);
  });
});
