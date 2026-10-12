import { notFound } from 'next/navigation';

import { CategoryForm } from '@/components/admin/category-form';
import { AdminPageHeader } from '@/components/admin/page-header';
import { requireAdminPage } from '@/services/admin-auth-service';
import { getCategoryById } from '@/repositories/category-repository';

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  const admin = await requireAdminPage();
  const category = await getCategoryById(admin.client, id);

  if (!category) notFound();

  return (
    <>
      <AdminPageHeader title={category.name} description="Edit this category." />
      <CategoryForm category={category} />
    </>
  );
}
