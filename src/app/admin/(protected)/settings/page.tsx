import { SettingsForm } from '@/components/admin/settings-form';
import { AdminPageHeader } from '@/components/admin/page-header';
import { requireAdminPage } from '@/services/admin-auth-service';
import { getSiteSettingsForAdmin } from '@/repositories/settings-repository';

export default async function AdminSettingsPage() {
  const admin = await requireAdminPage();
  const settings = await getSiteSettingsForAdmin(admin.client);

  return (
    <>
      <AdminPageHeader
        title="Business details"
        description="Phone, address, hours, social links and homepage wording. Changes appear across the site straight away."
      />
      <SettingsForm settings={settings} />
    </>
  );
}
