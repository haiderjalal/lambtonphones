import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Package, Phone } from 'lucide-react';

import { ButtonLink } from '@/components/shared/button-link';
import { Section } from '@/components/shared/section';
import { PageHeader } from '@/components/shared/page-header';
import { JsonLd } from '@/components/shared/json-ld';
import { ProductCard } from '@/components/shop/product-card';
import { Button } from '@/components/ui/button';
import { SERVICE_ICONS } from '@/constants/icons';
import { ROUTES, contactWithProductHref, productHref } from '@/constants/routes';
import { getMediaUrl } from '@/lib/supabase/media';
import { buildPageMetadata, buildProductJsonLd } from '@/lib/seo';
import {
  getProductPageData,
  getProductPageParams,
  getSiteSettings,
} from '@/services/public-content-service';
import { formatPrice, toTelHref } from '@/utils/format';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

/** Prebuilds every published product page. New products are rendered on first visit, then cached. */
export async function generateStaticParams() {
  return getProductPageParams();
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductPageData(slug);

  if (!data) {
    return { title: 'Product not found', robots: { index: false, follow: false } };
  }

  return buildPageMetadata({
    title: data.product.name,
    description:
      data.product.summary || `${data.product.name}, available at Lambton Phones & Repairs.`,
    path: productHref(data.product.slug),
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [data, settings] = await Promise.all([getProductPageData(slug), getSiteSettings()]);

  if (!data) notFound();

  const { product, related } = data;
  const imageUrl = getMediaUrl(product.image_path);
  const Icon = product.category ? SERVICE_ICONS[product.category.icon] : Package;
  const price = formatPrice(product.price_aud);

  return (
    <>
      {product.category ? (
        <JsonLd data={buildProductJsonLd(product, product.category.name)} />
      ) : null}

      <PageHeader
        eyebrow={product.category?.name ?? 'Accessories'}
        title={product.name}
        breadcrumbs={[
          { label: 'Home', href: ROUTES.home },
          { label: 'Shop', href: ROUTES.shop },
          ...(product.category
            ? [
                {
                  label: product.category.name,
                  href: `${ROUTES.shop}?category=${product.category.slug}`,
                },
              ]
            : []),
          { label: product.name },
        ]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="border-border from-secondary via-accent/50 to-secondary relative aspect-[4/3] overflow-hidden rounded-lg border bg-gradient-to-br lg:col-span-6">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Icon className="text-primary/70 size-24" aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="lg:col-span-6">
            <p className="text-brand-ink text-3xl font-bold">{price ?? 'Ask for price'}</p>
            {product.summary ? (
              <p className="text-foreground/90 mt-4 text-lg leading-relaxed">{product.summary}</p>
            ) : null}
            {product.description ? (
              <p className="text-muted-foreground mt-6 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            ) : null}

            <div className="border-border bg-card mt-10 grid gap-3 rounded-lg border p-6">
              <p className="text-brand-ink font-semibold">Interested in this accessory?</p>
              <p className="text-muted-foreground text-sm">
                Send an enquiry with your device model and we will confirm stock and pricing.
              </p>
              <ButtonLink
                href={contactWithProductHref(product.slug)}
                size="lg"
                className="mt-2 w-full sm:w-auto"
              >
                Enquire about this product
              </ButtonLink>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <a href={toTelHref(settings.phone)}>
                  <Phone className="size-4" aria-hidden="true" />
                  Call {settings.phone}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {related.length > 0 ? (
        <Section tone="muted" labelledBy="related-heading">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 id="related-heading" className="text-brand-ink text-2xl font-normal">
              More {product.category?.name.toLowerCase() ?? 'accessories'}
            </h2>
            <Link href={ROUTES.shop} className="text-primary text-sm font-semibold hover:underline">
              Back to the shop
            </Link>
          </div>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <li key={item.id}>
                <ProductCard product={item} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}
