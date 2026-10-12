import 'server-only';

import type { Metadata } from 'next';

import { SITE_NAME } from '@/constants/site';
import { getPublicEnv } from '@/lib/env/public';
import type { Product, SiteSettings } from '@/types/content';
import { toTelHref } from '@/utils/format';

export function absoluteUrl(path: string): string {
  return new URL(path, getPublicEnv().NEXT_PUBLIC_SITE_URL).toString();
}

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}

/** Title, description, canonical URL, Open Graph and Twitter tags for a single page. */
export function buildPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'en_AU',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export function buildLocalBusinessJsonLd(settings: SiteSettings): Record<string, unknown> {
  const sameAs = [settings.facebook_url, settings.instagram_url].filter(
    (url): url is string => url !== null,
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.business_name,
    description: settings.tagline,
    url: absoluteUrl('/'),
    telephone: toTelHref(settings.phone).replace('tel:', ''),
    email: settings.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.street_address,
      addressLocality: settings.suburb,
      addressRegion: settings.state,
      postalCode: settings.postcode,
      addressCountry: 'AU',
    },
    sameAs,
  };
}

export function buildProductJsonLd(
  product: Product,
  categoryName: string,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.summary,
    category: categoryName,
    ...(product.price_aud !== null
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'AUD',
            price: product.price_aud.toFixed(2),
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  };
}
