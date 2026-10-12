export const ROUTES = {
  home: '/',
  about: '/about',
  services: '/services',
  shop: '/shop',
  blog: '/blog',
  contact: '/contact',
  support: '/support',
  privacy: '/privacy',
  terms: '/terms',
  admin: {
    root: '/admin',
    login: '/admin/login',
    enquiries: '/admin/enquiries',
    products: '/admin/products',
    categories: '/admin/categories',
    services: '/admin/services',
    blog: '/admin/blog',
    faqs: '/admin/faqs',
    pages: '/admin/pages',
    settings: '/admin/settings',
  },
} as const;

/** Top-level services live at /<slug>; device pages nest under their parent (/phone-repair/iphone-repair). */
export function serviceHref(slug: string, parentSlug?: string): string {
  return parentSlug ? `/${parentSlug}/${slug}` : `/${slug}`;
}

export function productHref(slug: string): string {
  return `${ROUTES.shop}/${slug}`;
}

export function blogPostHref(slug: string): string {
  return `${ROUTES.blog}/${slug}`;
}

export function contactWithProductHref(productSlug: string): string {
  return `${ROUTES.contact}?product=${encodeURIComponent(productSlug)}`;
}
