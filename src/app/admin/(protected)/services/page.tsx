import Link from 'next/link';
import { Plus } from 'lucide-react';

import { PublishBadge } from '@/components/admin/status-badge';
import { AdminPageHeader } from '@/components/admin/page-header';
import { ButtonLink } from '@/components/shared/button-link';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ROUTES, serviceHref } from '@/constants/routes';
import { requireAdminPage } from '@/services/admin-auth-service';
import { listAllServices } from '@/repositories/service-repository';

export default async function AdminServicesPage() {
  const admin = await requireAdminPage();
  const services = await listAllServices(admin.client);
  const topLevel = services.filter((service) => service.parent_id === null);

  return (
    <>
      <AdminPageHeader
        title="Repair services"
        description="Top-level repair services and the device pages nested under them."
        actions={
          <ButtonLink href={`${ROUTES.admin.services}/new`}>
            <Plus className="size-4" aria-hidden="true" />
            New service
          </ButtonLink>
        }
      />

      <Card>
        <CardContent className="p-0">
          {topLevel.length === 0 ? (
            <p className="text-muted-foreground p-6 text-sm">No services yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead className="hidden md:table-cell">Public address</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topLevel.flatMap((parent) => [
                  <TableRow key={parent.id}>
                    <TableCell>
                      <Link
                        href={`${ROUTES.admin.services}/${parent.id}`}
                        className="text-primary font-semibold hover:underline"
                      >
                        {parent.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden font-mono text-xs md:table-cell">
                      {serviceHref(parent.slug)}
                    </TableCell>
                    <TableCell>
                      <PublishBadge isPublished={parent.is_published} />
                    </TableCell>
                  </TableRow>,
                  ...services
                    .filter((child) => child.parent_id === parent.id)
                    .map((child) => (
                      <TableRow key={child.id}>
                        <TableCell className="pl-10">
                          <Link
                            href={`${ROUTES.admin.services}/${child.id}`}
                            className="text-brand-ink hover:text-primary hover:underline"
                          >
                            {child.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground hidden font-mono text-xs md:table-cell">
                          {serviceHref(child.slug, parent.slug)}
                        </TableCell>
                        <TableCell>
                          <PublishBadge isPublished={child.is_published} />
                        </TableCell>
                      </TableRow>
                    )),
                ])}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
