import { notFound } from 'next/navigation';

import { FaqForm } from '@/components/admin/faq-form';
import { AdminPageHeader } from '@/components/admin/page-header';
import { requireAdminPage } from '@/services/admin-auth-service';
import { getFaqById } from '@/repositories/content-repository';

interface EditFaqPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFaqPage({ params }: EditFaqPageProps) {
  const { id } = await params;
  const admin = await requireAdminPage();
  const faq = await getFaqById(admin.client, id);

  if (!faq) notFound();

  return (
    <>
      <AdminPageHeader
        title="Edit question"
        description="Changes appear on the website straight away."
      />
      <FaqForm faq={faq} />
    </>
  );
}
