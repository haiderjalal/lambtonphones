import Image from 'next/image';
import Link from 'next/link';
import { Package } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { TiltCard } from '@/components/shared/tilt-card';
import { SERVICE_ICONS } from '@/constants/icons';
import { productHref } from '@/constants/routes';
import { getMediaUrl } from '@/lib/supabase/media';
import type { ProductWithCategory } from '@/types/content';
import { formatPrice } from '@/utils/format';

interface ProductCardProps {
  product: ProductWithCategory;
}

/**
 * Accessory tile. Shows the uploaded photo when there is one, otherwise a category icon on a plain
 * panel. The tile tilts toward the pointer and its photo zooms slowly on hover.
 */
export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getMediaUrl(product.image_path);
  const Icon = product.category ? SERVICE_ICONS[product.category.icon] : Package;
  const price = formatPrice(product.price_aud);

  return (
    <TiltCard>
      <Link
        href={productHref(product.slug)}
        className="group border-border bg-card hover:border-brand-ink/30 flex h-full flex-col overflow-hidden rounded-lg border transition-colors duration-500"
      >
        <div className="bg-secondary relative aspect-[4/3] overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Icon className="text-primary/60 size-12" aria-hidden="true" />
            </div>
          )}
          {product.is_featured ? (
            <Badge className="bg-card text-brand-ink hover:bg-card absolute top-3 left-3 rounded-md">
              Featured
            </Badge>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-5">
          {product.category ? (
            <p className="text-muted-foreground text-xs font-medium tracking-[0.14em] uppercase">
              {product.category.name}
            </p>
          ) : null}
          <h3 className="text-brand-ink mt-2 text-base font-semibold">{product.name}</h3>
          {product.summary ? (
            <p className="text-muted-foreground mt-1.5 flex-1 text-sm leading-relaxed">
              {product.summary}
            </p>
          ) : null}
          <p className="text-brand-ink mt-4 text-sm font-medium">{price ?? 'Ask for price'}</p>
        </div>
      </Link>
    </TiltCard>
  );
}
