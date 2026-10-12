import { CategoryForm } from '@/components/admin/category-form';
import { AdminPageHeader } from '@/components/admin/page-header';

export default function NewCategoryPage() {
  return (
    <>
      <AdminPageHeader title="New category" description="Create a group to filter products by." />
      <CategoryForm category={null} />
    </>
  );
}
