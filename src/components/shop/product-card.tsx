import Image from 'next/image';
import Link from 'next/link';
import { Package } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { SERVICE_ICONS } from '@/constants/icons';
import { productHref } from '@/constants/routes';
import { getMediaUrl } from '@/lib/supabase/media';
import type { ProductWithCategory } from '@/types/content';
import { formatPrice } from '@/utils/format';

interface ProductCardProps {
  product: ProductWithCategory;
}

/** Accessory tile. Shows the uploaded photo when there is one, otherwise a category-coloured icon. */
export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getMediaUrl(product.image_path);
  const Icon = product.category ? SERVICE_ICONS[product.category.icon] : Package;
  const price = formatPrice(product.price_aud);

  return (
    <Link
      href={productHref(product.slug)}
      className="group border-border bg-card hover:border-primary/40 hover:shadow-primary/10 flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="from-secondary via-accent/50 to-secondary relative aspect-[4/3] overflow-hidden bg-gradient-to-br">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Icon
              className="text-primary/70 size-14 transition-transform duration-500 group-hover:scale-110"
              aria-hidden="true"
            />
          </div>
        )}
        {product.is_featured ? (
          <Badge className="bg-brand-highlight text-brand-ink hover:bg-brand-highlight absolute top-3 left-3">
            Featured
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {product.category ? (
          <p className="text-primary text-xs font-semibold tracking-wider uppercase">
            {product.category.name}
          </p>
        ) : null}
        <h3 className="text-brand-ink mt-1.5 text-base font-semibold">{product.name}</h3>
        {product.summary ? (
          <p className="text-muted-foreground mt-1.5 flex-1 text-sm leading-relaxed">
            {product.summary}
          </p>
        ) : null}
        <p className="text-brand-ink mt-4 text-sm font-semibold">{price ?? 'Ask for price'}</p>
      </div>
    </Link>
  );
}
