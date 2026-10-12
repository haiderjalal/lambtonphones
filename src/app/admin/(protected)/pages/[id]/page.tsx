import { notFound } from 'next/navigation';

import { PageForm } from '@/components/admin/page-form';
import { AdminPageHeader } from '@/components/admin/page-header';
import { requireAdminPage } from '@/services/admin-auth-service';
import { getPageById } from '@/repositories/content-repository';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditContentPage({ params }: EditPageProps) {
  const { id } = await params;
  const admin = await requireAdminPage();
  const page = await getPageById(admin.client, id);

  if (!page) notFound();

  return (
    <>
      <AdminPageHeader title={page.title} description={`Public address: /${page.slug}`} />
      <PageForm page={page} />
    </>
  );
}
