import Link from 'next/link';
import { Plus } from 'lucide-react';

import { PublishBadge } from '@/components/admin/status-badge';
import { AdminPageHeader } from '@/components/admin/page-header';
import { ButtonLink } from '@/components/shared/button-link';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ROUTES } from '@/constants/routes';
import { requireAdminPage } from '@/services/admin-auth-service';
import { listAllProducts } from '@/repositories/product-repository';
import { formatPrice } from '@/utils/format';

export default async function AdminProductsPage() {
  const admin = await requireAdminPage();
  const products = await listAllProducts(admin.client);

  return (
    <>
      <AdminPageHeader
        title="Products"
        description="Accessories shown in the shop. Unpublished items stay hidden from visitors."
        actions={
          <ButtonLink href={`${ROUTES.admin.products}/new`}>
            <Plus className="size-4" aria-hidden="true" />
            New product
          </ButtonLink>
        }
      />

      <Card>
        <CardContent className="p-0">
          {products.length === 0 ? (
            <p className="text-muted-foreground p-6 text-sm">
              No products yet. Add your first accessory to get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden sm:table-cell">Price</TableHead>
                  <TableHead className="hidden lg:table-cell">Featured</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Link
                        href={`${ROUTES.admin.products}/${product.id}`}
                        className="text-primary font-semibold hover:underline"
                      >
                        {product.name}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {product.category?.name ?? 'Uncategorised'}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {formatPrice(product.price_aud) ?? 'Ask for price'}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {product.is_featured ? 'Yes' : 'No'}
                    </TableCell>
                    <TableCell>
                      <PublishBadge isPublished={product.is_published} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
