import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { AdminShell } from '@/components/admin/admin-shell';
import { requireAdminPage } from '@/services/admin-auth-service';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** Every page in this group requires an administrator. The check runs on the server, not in the browser. */
export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdminPage();

  return <AdminShell email={admin.email}>{children}</AdminShell>;
}
