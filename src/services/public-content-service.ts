import 'server-only';

import type { Faq, Service, ServiceWithChildren } from '@/types/content';
import { getPublishedSiteSettings } from '@/repositories/settings-repository';
import { listPublishedServices } from '@/repositories/service-repository';
import { listPublishedCategories } from '@/repositories/category-repository';
import {
  getPublishedProductBySlug,
  listPublishedProducts,
} from '@/repositories/product-repository';
import {
  getPublishedBlogPostBySlug,
  getPublishedPageBySlug,
  listPublishedBlogPosts,
  listPublishedFaqs,
} from '@/repositories/content-repository';

// Read-side facade for public pages. Pages call this layer, never a repository or Supabase directly.

const HOME_FEATURED_LIMIT = 4;
const RELATED_PRODUCT_LIMIT = 4;

export async function getTopLevelServices(): Promise<ServiceWithChildren[]> {
  const services = await listPublishedServices();

  return services
    .filter((service) => service.parent_id === null)
    .map((parent) => ({
      ...parent,
      children: services.filter((service) => service.parent_id === parent.id),
    }));
}

export async function getServiceBySlug(slug: string): Promise<ServiceWithChildren | null> {
  const services = await getTopLevelServices();

  return services.find((service) => service.slug === slug) ?? null;
}

export async function getDevicePageParams(): Promise<{ service: string; device: string }[]> {
  const services = await listPublishedServices();
  const parentById = new Map(
    services
      .filter((service) => service.parent_id === null)
      .map((parent) => [parent.id, parent.slug]),
  );

  return services.flatMap((service) => {
    const parentSlug = service.parent_id ? parentById.get(service.parent_id) : undefined;
    return parentSlug ? [{ service: parentSlug, device: service.slug }] : [];
  });
}

export async function getDeviceServiceBySlugs(
  parentSlug: string,
  deviceSlug: string,
): Promise<{ parent: Service; device: Service } | null> {
  const services = await listPublishedServices();
  const parent = services.find(
    (service) => service.slug === parentSlug && service.parent_id === null,
  );

  if (!parent) return null;

  const device = services.find(
    (service) => service.slug === deviceSlug && service.parent_id === parent.id,
  );

  return device ? { parent, device } : null;
}

export async function getHomePageData() {
  const [settings, services, products, faqs] = await Promise.all([
    getPublishedSiteSettings(),
    getTopLevelServices(),
    listPublishedProducts(),
    listPublishedFaqs(),
  ]);

  const featured = products.filter((product) => product.is_featured);
  const showcase = (featured.length > 0 ? featured : products).slice(0, HOME_FEATURED_LIMIT);

  return { settings, services, featuredProducts: showcase, faqs };
}

export async function getShopPageData(filters: {
  categorySlug: string | null;
  query: string | null;
}) {
  const [categories, products] = await Promise.all([
    listPublishedCategories(),
    listPublishedProducts(),
  ]);
  const normalisedQuery = filters.query?.trim().toLowerCase() ?? '';

  const filtered = products.filter((product) => {
    const matchesCategory =
      filters.categorySlug === null || product.category?.slug === filters.categorySlug;
    const matchesQuery =
      normalisedQuery.length === 0 ||
      product.name.toLowerCase().includes(normalisedQuery) ||
      product.summary.toLowerCase().includes(normalisedQuery);

    return matchesCategory && matchesQuery;
  });

  return {
    categories,
    products: filtered,
    activeCategory: categories.find((category) => category.slug === filters.categorySlug) ?? null,
    query: filters.query?.trim() ?? '',
  };
}

/** Published records that need a sitemap entry, fetched together so the sitemap costs one round trip. */
export async function getSitemapData() {
  const [services, products, posts] = await Promise.all([
    listPublishedServices(),
    listPublishedProducts(),
    listPublishedBlogPosts(),
  ]);

  return { services, products, posts };
}

export async function getProductPageParams(): Promise<{ slug: string }[]> {
  const products = await listPublishedProducts();

  return products.map((product) => ({ slug: product.slug }));
}

export async function getBlogPostParams(): Promise<{ slug: string }[]> {
  const posts = await getBlogIndexData();

  return posts.map((post) => ({ slug: post.slug }));
}

/** Product lookup for enquiry pages. Returns null for unpublished or unknown products. */
export async function getProductForEnquiry(slug: string) {
  return getPublishedProductBySlug(slug);
}

export async function getProductPageData(slug: string) {
  const product = await getPublishedProductBySlug(slug);

  if (!product) return null;

  const allProducts = await listPublishedProducts();
  const related = allProducts
    .filter(
      (candidate) => candidate.category_id === product.category_id && candidate.id !== product.id,
    )
    .slice(0, RELATED_PRODUCT_LIMIT);

  return { product, related };
}

export async function getBlogIndexData() {
  return listPublishedBlogPosts();
}

export async function getBlogPostData(slug: string) {
  return getPublishedBlogPostBySlug(slug);
}

export async function getFaqs(): Promise<Faq[]> {
  return listPublishedFaqs();
}

export async function getContentPage(slug: string) {
  return getPublishedPageBySlug(slug);
}

export async function getSiteSettings() {
  return getPublishedSiteSettings();
}
