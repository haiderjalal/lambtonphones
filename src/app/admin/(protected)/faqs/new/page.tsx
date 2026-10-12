import { FaqForm } from '@/components/admin/faq-form';
import { AdminPageHeader } from '@/components/admin/page-header';

export default function NewFaqPage() {
  return (
    <>
      <AdminPageHeader title="New question" description="Add a question and answer for visitors." />
      <FaqForm faq={null} />
    </>
  );
}
