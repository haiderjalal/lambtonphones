import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  tone?: 'light' | 'dark';
  className?: string;
}

/** Breadcrumb trail. The last item is the current page, so it is not a link. */
export function Breadcrumbs({ items, tone = 'light', className }: BreadcrumbsProps) {
  const isDark = tone === 'dark';

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol
        className={cn(
          'flex flex-wrap items-center gap-1.5 text-sm',
          isDark ? 'text-slate-300' : 'text-muted-foreground',
        )}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? (
                <ChevronRight className="size-3.5 opacity-60" aria-hidden="true" />
              ) : null}
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-primary transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={cn(
                    isLast && 'font-medium',
                    isLast && (isDark ? 'text-white' : 'text-foreground'),
                  )}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
