import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constants/routes';

interface ShopSearchProps {
  query: string;
  activeCategory: string | null;
}

/** Native GET form. Works without JavaScript and keeps the active category when searching. */
export function ShopSearch({ query, activeCategory }: ShopSearchProps) {
  return (
    <form role="search" action={ROUTES.shop} method="get" className="flex w-full max-w-md gap-2">
      {activeCategory ? <input type="hidden" name="category" value={activeCategory} /> : null}
      <label htmlFor="shop-search" className="sr-only">
        Search accessories
      </label>
      <Input
        id="shop-search"
        name="q"
        type="search"
        defaultValue={query}
        placeholder="Search cases, chargers, glass..."
        className="bg-card"
      />
      <Button type="submit" variant="default">
        <Search className="size-4" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">Search</span>
      </Button>
    </form>
  );
}
