import Link from 'next/link';
import { SearchX } from 'lucide-react';

import { CategoryChips } from '@/components/shop/category-chips';
import { ProductCard } from '@/components/shop/product-card';
import { ShopSearch } from '@/components/shop/shop-search';
import { EmptyState } from '@/components/shared/empty-state';
import { PageHeader } from '@/components/shared/page-header';
import { Section } from '@/components/shared/section';
import { ROUTES } from '@/constants/routes';
import { SHOP_BANNER_IMAGE } from '@/constants/site-images';
import { buildPageMetadata } from '@/lib/seo';
import { getShopPageData } from '@/services/public-content-service';
import { firstParam } from '@/utils/search-params';

interface ShopPageProps {
  searchParams: Promise<{ category?: string | string[]; q?: string | string[] }>;
}

export const metadata = buildPageMetadata({
  title: 'Phone and tablet accessories',
  description:
    'Glass protectors, cases, chargers, audio and car accessories. Ask us about any product in store or by phone.',
  path: ROUTES.shop,
});

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const categorySlug = firstParam(params.category);
  const query = firstParam(params.q);

  const { categories, products, activeCategory } = await getShopPageData({ categorySlug, query });
  const hasFilters = categorySlug !== null || query !== null;

  return (
    <>
      <PageHeader
        eyebrow="Accessories"
        title="Accessories to protect and power your devices"
        description="Browse our range of protection, charging, audio and car accessories. Ask for pricing on anything you see."
        breadcrumbs={[{ label: 'Home', href: ROUTES.home }, { label: 'Shop' }]}
        image={SHOP_BANNER_IMAGE}
      />

      <Section>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <CategoryChips
            categories={categories}
            activeSlug={activeCategory?.slug ?? null}
            query={query ?? ''}
          />
          <ShopSearch query={query ?? ''} activeCategory={activeCategory?.slug ?? null} />
        </div>

        <p className="text-muted-foreground mt-8 text-sm" aria-live="polite">
          {products.length === 1 ? '1 product' : `${products.length} products`}
          {activeCategory ? ` in ${activeCategory.name}` : ''}
          {query ? ` matching "${query}"` : ''}
        </p>

        {products.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={SearchX}
              title="No products match those filters"
              description="Try a different search term or browse all accessories."
              action={
                hasFilters ? (
                  <Link
                    href={ROUTES.shop}
                    className="text-primary text-sm font-semibold hover:underline"
                  >
                    Clear filters
                  </Link>
                ) : null
              }
            />
          </div>
        ) : (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
