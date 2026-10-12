import { describe, expect, it } from 'vitest';

import { mediaPathSchema } from '@/lib/validations/common';
import { productSchema, serviceSchema, siteSettingsSchema } from '@/lib/validations/content';

const CATEGORY_ID = '3f1c2d4e-5a6b-4c7d-8e9f-0a1b2c3d4e5f';

const productInput = {
  name: 'Clear Case',
  slug: 'clear-case',
  categoryId: CATEGORY_ID,
  summary: '',
  description: '',
  priceAud: '49.95',
  imagePath: null,
  isFeatured: false,
  isPublished: true,
  sortOrder: '3',
};

const serviceInput = {
  name: 'Phone Repair',
  slug: 'phone-repair',
  parentId: '',
  summary: '',
  description: '',
  highlights: 'Screen\n\n  Battery  \n',
  icon: 'smartphone',
  sortOrder: '1',
  isPublished: true,
};

const settingsInput = {
  businessName: 'Lambton Phones & Repairs',
  tagline: '',
  phone: '02 4957 8574',
  email: 'shop@example.com',
  streetAddress: '33 Alma Rd',
  suburb: 'New Lambton',
  state: 'NSW',
  postcode: '2305',
  mapsUrl: '',
  facebookUrl: '',
  instagramUrl: '',
  heroHeading: 'Expert device repairs',
  heroSubheading: 'Certified technicians.',
  announcementText: '',
  announcementActive: false,
  openingHours: 'Monday to Friday: 9 am to 5 pm',
  trustHighlights: '',
};

describe('productSchema', () => {
  it('converts the price and display order into numbers', () => {
    const result = productSchema.safeParse(productInput);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.priceAud).toBe(49.95);
      expect(result.data.sortOrder).toBe(3);
    }
  });

  it('treats a blank price as ask for price', () => {
    const result = productSchema.safeParse({ ...productInput, priceAud: '' });

    expect(result.success && result.data.priceAud).toBeNull();
  });

  it('rejects prices with more than two decimal places', () => {
    expect(productSchema.safeParse({ ...productInput, priceAud: '10.999' }).success).toBe(false);
  });

  it('rejects slugs that are not lowercase, hyphenated words', () => {
    expect(productSchema.safeParse({ ...productInput, slug: 'Clear Case' }).success).toBe(false);
  });
});

describe('mediaPathSchema', () => {
  it('accepts paths produced by the upload service', () => {
    expect(
      mediaPathSchema.safeParse('products/9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d.webp').success,
    ).toBe(true);
  });

  it('rejects traversal and arbitrary storage paths', () => {
    expect(mediaPathSchema.safeParse('../secrets.env').success).toBe(false);
    expect(mediaPathSchema.safeParse('products/../../x.png').success).toBe(false);
    expect(mediaPathSchema.safeParse('uploads/evil.png').success).toBe(false);
  });
});

describe('serviceSchema', () => {
  it('splits highlights into one trimmed item per line and drops blanks', () => {
    const result = serviceSchema.safeParse(serviceInput);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.highlights).toEqual(['Screen', 'Battery']);
      expect(result.data.parentId).toBeNull();
    }
  });

  it('rejects more than twelve highlights', () => {
    const highlights = Array.from({ length: 13 }, (_, index) => `Item ${index}`).join('\n');

    expect(serviceSchema.safeParse({ ...serviceInput, highlights }).success).toBe(false);
  });
});

describe('siteSettingsSchema', () => {
  it('accepts a complete set of business details', () => {
    expect(siteSettingsSchema.safeParse(settingsInput).success).toBe(true);
  });

  it('requires announcement text before the announcement can be shown', () => {
    const result = siteSettingsSchema.safeParse({ ...settingsInput, announcementActive: true });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(['announcementText']);
    }
  });

  it('rejects links that are not secure https addresses', () => {
    expect(
      siteSettingsSchema.safeParse({ ...settingsInput, mapsUrl: 'http://insecure.example' })
        .success,
    ).toBe(false);
  });
});
