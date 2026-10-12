import Link from 'next/link';

import { ProductForm } from '@/components/admin/product-form';
import { AdminPageHeader } from '@/components/admin/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { requireAdminPage } from '@/services/admin-auth-service';
import { listAllCategories } from '@/repositories/category-repository';

export default async function NewProductPage() {
  const admin = await requireAdminPage();
  const categories = await listAllCategories(admin.client);

  return (
    <>
      <AdminPageHeader title="New product" description="Add an accessory to the shop." />

      {categories.length === 0 ? (
        <Card className="mb-6 max-w-3xl">
          <CardContent className="pt-6 text-sm">
            Create a category before adding products.{' '}
            <Link
              href={`${ROUTES.admin.categories}/new`}
              className="text-primary font-semibold hover:underline"
            >
              Add a category
            </Link>
          </CardContent>
        </Card>
      ) : null}

      <ProductForm product={null} categories={categories} savedImageUrl={null} />
    </>
  );
}
