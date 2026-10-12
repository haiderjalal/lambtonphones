/**
 * Cache tags for public content. Every cached read is tagged, and every admin save invalidates
 * the matching tag, so edits appear immediately without rebuilding the site.
 */
export const CACHE_TAGS = {
  siteSettings: 'site-settings',
  services: 'services',
  productCategories: 'product-categories',
  products: 'products',
  blogPosts: 'blog-posts',
  faqs: 'faqs',
  pages: 'pages',
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

/** Safety net: cached content is refreshed at least hourly even if an invalidation is missed. */
export const CONTENT_REVALIDATE_SECONDS = 3600;
