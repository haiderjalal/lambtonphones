import { ButtonLink } from '@/components/shared/button-link';
import { Reveal } from '@/components/shared/reveal';
import { Section } from '@/components/shared/section';
import { SectionHeading } from '@/components/shared/section-heading';
import { ProductCard } from '@/components/shop/product-card';
import { ROUTES } from '@/constants/routes';
import type { ProductWithCategory } from '@/types/content';

interface FeaturedProductsSectionProps {
  products: ProductWithCategory[];
}

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  if (products.length === 0) return null;

  return (
    <Section labelledBy="accessories-heading">
      <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Accessories"
          titleId="accessories-heading"
          title="Protect and power your devices"
          description="Cases, glass protectors, chargers and audio gear, picked by our technicians."
        />
        <ButtonLink href={ROUTES.shop} variant="outline" className="shrink-0">
          Browse all accessories
        </ButtonLink>
      </Reveal>

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, index) => (
          <li key={product.id}>
            <Reveal depth delayMs={index * 80} className="h-full">
              <ProductCard product={product} />
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
