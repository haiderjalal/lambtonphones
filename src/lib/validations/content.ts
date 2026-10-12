import { z } from 'zod';

import { AU_STATES } from '@/constants/business';
import { SERVICE_ICON_KEYS } from '@/constants/icons';
import {
  emailSchema,
  mediaPathSchema,
  multilineList,
  optionalHttpsUrl,
  optionalText,
  optionalUuidSchema,
  phoneSchema,
  requiredText,
  requiredUuid,
  slugSchema,
  sortOrderSchema,
} from '@/lib/validations/common';

// Admin content schemas. Form fields arrive as strings and are transformed into database values.

const priceSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === '' || /^\d{1,6}(\.\d{1,2})?$/.test(value),
    'Enter a price such as 49.95, or leave it blank to show "Ask for price".',
  )
  .transform((value) => (value === '' ? null : Number(value)));

export const productSchema = z.object({
  name: requiredText('Name', { min: 2, max: 120 }),
  slug: slugSchema,
  categoryId: requiredUuid('Choose a category.'),
  summary: optionalText('Summary', 240),
  description: optionalText('Description', 5000),
  priceAud: priceSchema,
  imagePath: mediaPathSchema,
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  sortOrder: sortOrderSchema,
});

export type ProductInput = z.input<typeof productSchema>;
export type ProductValues = z.output<typeof productSchema>;

export const categorySchema = z.object({
  name: requiredText('Name', { min: 2, max: 120 }),
  slug: slugSchema,
  description: optionalText('Description', 240),
  icon: z.enum(SERVICE_ICON_KEYS, { error: 'Choose an icon.' }),
  sortOrder: sortOrderSchema,
  isPublished: z.boolean(),
});

export type CategoryInput = z.input<typeof categorySchema>;
export type CategoryValues = z.output<typeof categorySchema>;

export const serviceSchema = z.object({
  name: requiredText('Name', { min: 2, max: 120 }),
  slug: slugSchema,
  parentId: optionalUuidSchema,
  summary: optionalText('Summary', 240),
  description: optionalText('Description', 5000),
  highlights: multilineList('Highlights', { maxItems: 12, maxItemLength: 120 }),
  icon: z.enum(SERVICE_ICON_KEYS, { error: 'Choose an icon.' }),
  sortOrder: sortOrderSchema,
  isPublished: z.boolean(),
});

export type ServiceInput = z.input<typeof serviceSchema>;
export type ServiceValues = z.output<typeof serviceSchema>;

export const blogPostSchema = z.object({
  title: requiredText('Title', { min: 2, max: 160 }),
  slug: slugSchema,
  excerpt: optionalText('Excerpt', 300),
  body: optionalText('Article body', 50000),
  coverImagePath: mediaPathSchema,
  isPublished: z.boolean(),
});

export type BlogPostInput = z.input<typeof blogPostSchema>;
export type BlogPostValues = z.output<typeof blogPostSchema>;

export const faqSchema = z.object({
  question: requiredText('Question', { min: 5, max: 240 }),
  answer: requiredText('Answer', { min: 1, max: 2000 }),
  sortOrder: sortOrderSchema,
  isPublished: z.boolean(),
});

export type FaqInput = z.input<typeof faqSchema>;
export type FaqValues = z.output<typeof faqSchema>;

export const contentPageSchema = z.object({
  title: requiredText('Title', { min: 2, max: 120 }),
  slug: slugSchema,
  metaDescription: optionalText('Meta description', 160),
  body: requiredText('Page content', { min: 1, max: 50000 }),
  isPublished: z.boolean(),
});

export type ContentPageInput = z.input<typeof contentPageSchema>;
export type ContentPageValues = z.output<typeof contentPageSchema>;

export const siteSettingsSchema = z
  .object({
    businessName: requiredText('Business name', { min: 2, max: 120 }),
    tagline: optionalText('Tagline', 160),
    phone: phoneSchema,
    email: emailSchema,
    streetAddress: requiredText('Street address', { min: 3, max: 120 }),
    suburb: requiredText('Suburb', { min: 2, max: 80 }),
    state: z.enum(AU_STATES, { error: 'Choose a state or territory.' }),
    postcode: z
      .string()
      .trim()
      .regex(/^\d{4}$/, 'Postcode must be 4 digits.'),
    mapsUrl: optionalHttpsUrl('Maps link'),
    facebookUrl: optionalHttpsUrl('Facebook link'),
    instagramUrl: optionalHttpsUrl('Instagram link'),
    heroHeading: requiredText('Homepage heading', { min: 4, max: 140 }),
    heroSubheading: requiredText('Homepage subheading', { min: 4, max: 400 }),
    announcementText: optionalText('Announcement', 200),
    announcementActive: z.boolean(),
    openingHours: multilineList('Opening hours', { maxItems: 10, maxItemLength: 120 }).pipe(
      z.array(z.string()).min(1, 'Add at least one line of opening hours.'),
    ),
    trustHighlights: multilineList('Trust highlights', { maxItems: 12, maxItemLength: 120 }),
  })
  .refine((settings) => !settings.announcementActive || settings.announcementText.length > 0, {
    path: ['announcementText'],
    message: 'Add announcement text before turning the announcement on.',
  });

export type SiteSettingsInput = z.input<typeof siteSettingsSchema>;
export type SiteSettingsValues = z.output<typeof siteSettingsSchema>;
