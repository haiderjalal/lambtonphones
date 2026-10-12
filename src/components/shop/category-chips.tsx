import Link from 'next/link';

import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import type { ProductCategory } from '@/types/content';

interface CategoryChipsProps {
  categories: ProductCategory[];
  activeSlug: string | null;
  query: string;
}

const CHIP_BASE =
  'inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200';

/** Category filter as plain links, so filtering works without JavaScript and each view is shareable. */
export function CategoryChips({ categories, activeSlug, query }: CategoryChipsProps) {
  const hrefFor = (slug: string | null) => {
    const params = new URLSearchParams();
    if (slug) params.set('category', slug);
    if (query) params.set('q', query);

    const search = params.toString();
    return search ? `${ROUTES.shop}?${search}` : ROUTES.shop;
  };

  const chips = [
    { slug: null, name: 'All accessories' },
    ...categories.map((category) => ({ slug: category.slug, name: category.name })),
  ];

  return (
    <nav aria-label="Filter by category">
      <ul className="flex flex-wrap gap-2.5">
        {chips.map((chip) => {
          const isActive = chip.slug === activeSlug;

          return (
            <li key={chip.slug ?? 'all'}>
              <Link
                href={hrefFor(chip.slug)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  CHIP_BASE,
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-brand-ink hover:border-primary/50 hover:text-primary',
                )}
              >
                {chip.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
