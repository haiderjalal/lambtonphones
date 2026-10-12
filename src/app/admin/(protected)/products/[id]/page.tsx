import { notFound } from 'next/navigation';

import { ProductForm } from '@/components/admin/product-form';
import { AdminPageHeader } from '@/components/admin/page-header';
import { requireAdminPage } from '@/services/admin-auth-service';
import { listAllCategories } from '@/repositories/category-repository';
import { getProductById } from '@/repositories/product-repository';
import { getMediaUrl } from '@/lib/supabase/media';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const admin = await requireAdminPage();
  const [product, categories] = await Promise.all([
    getProductById(admin.client, id),
    listAllCategories(admin.client),
  ]);

  if (!product) notFound();

  return (
    <>
      <AdminPageHeader
        title={product.name}
        description="Edit this product. Changes appear on the shop straight away."
      />
      <ProductForm
        product={product}
        categories={categories}
        savedImageUrl={getMediaUrl(product.image_path)}
      />
    </>
  );
}
