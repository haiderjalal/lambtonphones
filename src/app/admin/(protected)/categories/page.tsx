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
import { ROUTES } from '@/constants/routes';
import { requireAdminPage } from '@/services/admin-auth-service';
import { listAllCategories } from '@/repositories/category-repository';

export default async function AdminCategoriesPage() {
  const admin = await requireAdminPage();
  const categories = await listAllCategories(admin.client);

  return (
    <>
      <AdminPageHeader
        title="Product categories"
        description="Groups used to filter the shop."
        actions={
          <ButtonLink href={`${ROUTES.admin.categories}/new`}>
            <Plus className="size-4" aria-hidden="true" />
            New category
          </ButtonLink>
        }
      />

      <Card>
        <CardContent className="p-0">
          {categories.length === 0 ? (
            <p className="text-muted-foreground p-6 text-sm">No categories yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="hidden sm:table-cell">Order</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <Link
                        href={`${ROUTES.admin.categories}/${category.id}`}
                        className="text-primary font-semibold hover:underline"
                      >
                        {category.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell">
                      {category.description}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{category.sort_order}</TableCell>
                    <TableCell>
                      <PublishBadge isPublished={category.is_published} />
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
