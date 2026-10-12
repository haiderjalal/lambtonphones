import { ServiceForm } from '@/components/admin/service-form';
import { AdminPageHeader } from '@/components/admin/page-header';
import { requireAdminPage } from '@/services/admin-auth-service';
import { listAllServices } from '@/repositories/service-repository';

export default async function NewServicePage() {
  const admin = await requireAdminPage();
  const services = await listAllServices(admin.client);

  return (
    <>
      <AdminPageHeader title="New service" description="Add a repair service or a device page." />
      <ServiceForm
        service={null}
        parentOptions={services.filter((service) => service.parent_id === null)}
        hasDevicePages={false}
      />
    </>
  );
}
