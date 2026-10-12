import { notFound } from 'next/navigation';

import { ServiceForm } from '@/components/admin/service-form';
import { AdminPageHeader } from '@/components/admin/page-header';
import { requireAdminPage } from '@/services/admin-auth-service';
import { getServiceById, listAllServices } from '@/repositories/service-repository';

interface EditServicePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params;
  const admin = await requireAdminPage();
  const [service, services] = await Promise.all([
    getServiceById(admin.client, id),
    listAllServices(admin.client),
  ]);

  if (!service) notFound();

  const hasDevicePages = services.some((candidate) => candidate.parent_id === service.id);

  return (
    <>
      <AdminPageHeader
        title={service.name}
        description="Edit this service. Changes appear on the website straight away."
      />
      <ServiceForm
        service={service}
        parentOptions={services.filter(
          (candidate) => candidate.parent_id === null && candidate.id !== service.id,
        )}
        hasDevicePages={hasDevicePages}
      />
    </>
  );
}
