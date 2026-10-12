import type { MetadataRoute } from 'next';

import { ROUTES } from '@/constants/routes';
import { absoluteUrl } from '@/lib/seo';
import { getSitemapData } from '@/services/public-content-service';

const STATIC_PATHS: { path: string; priority: number }[] = [
  { path: ROUTES.home, priority: 1 },
  { path: ROUTES.shop, priority: 0.9 },
  { path: ROUTES.services, priority: 0.9 },
  { path: ROUTES.contact, priority: 0.9 },
  { path: ROUTES.about, priority: 0.7 },
  { path: ROUTES.blog, priority: 0.6 },
  { path: ROUTES.support, priority: 0.6 },
  { path: ROUTES.privacy, priority: 0.3 },
  { path: ROUTES.terms, priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { services, products, posts } = await getSitemapData();

  const serviceById = new Map(services.map((service) => [service.id, service]));

  const serviceEntries = services.map((service) => {
    const parent = service.parent_id ? serviceById.get(service.parent_id) : undefined;
    const path = parent ? `/${parent.slug}/${service.slug}` : `/${service.slug}`;

    return { url: absoluteUrl(path), lastModified: new Date(service.updated_at), priority: 0.8 };
  });

  return [
    ...STATIC_PATHS.map(({ path, priority }) => ({ url: absoluteUrl(path), priority })),
    ...serviceEntries,
    ...products.map((product) => ({
      url: absoluteUrl(`${ROUTES.shop}/${product.slug}`),
      lastModified: new Date(product.updated_at),
      priority: 0.7,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`${ROUTES.blog}/${post.slug}`),
      lastModified: new Date(post.updated_at),
      priority: 0.6,
    })),
  ];
}
