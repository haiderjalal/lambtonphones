import Link from 'next/link';

import { PublishBadge } from '@/components/admin/status-badge';
import { AdminPageHeader } from '@/components/admin/page-header';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ROUTES } from '@/constants/routes';
import { requireAdminPage } from '@/services/admin-auth-service';
import { listAllPages } from '@/repositories/content-repository';

export default async function AdminPagesListPage() {
  const admin = await requireAdminPage();
  const pages = await listAllPages(admin.client);

  return (
    <>
      <AdminPageHeader
        title="Pages"
        description="Long-form content such as About us, the privacy policy and terms."
      />

      <Card>
        <CardContent className="p-0">
          {pages.length === 0 ? (
            <p className="text-muted-foreground p-6 text-sm">No pages found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Address</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell>
                      <Link
                        href={`${ROUTES.admin.pages}/${page.id}`}
                        className="text-primary font-semibold hover:underline"
                      >
                        {page.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden font-mono text-xs md:table-cell">
                      /{page.slug}
                    </TableCell>
                    <TableCell>
                      <PublishBadge isPublished={page.is_published} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
