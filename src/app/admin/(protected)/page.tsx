import { BookOpen, Inbox, Package, Users } from 'lucide-react';

import { StatCard } from '@/components/admin/stat-card';
import { EnquiryStatusBadge } from '@/components/admin/status-badge';
import { AdminPageHeader } from '@/components/admin/page-header';
import { ButtonLink } from '@/components/shared/button-link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { listAllBlogPosts } from '@/repositories/content-repository';
import { listAllProducts } from '@/repositories/product-repository';
import { listEnquiries } from '@/repositories/enquiry-repository';
import { formatDateTime } from '@/utils/format';

export default async function AdminDashboardPage() {
  const admin = await requireAdminPage();

  const [enquiries, products, posts] = await Promise.all([
    listEnquiries(admin.client, null),
    listAllProducts(admin.client),
    listAllBlogPosts(admin.client),
  ]);

  const newCount = enquiries.filter((enquiry) => enquiry.status === 'new').length;
  const publishedProducts = products.filter((product) => product.is_published).length;
  const publishedPosts = posts.filter((post) => post.is_published).length;
  const recent = enquiries.slice(0, 8);

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="New enquiries and the state of the website content."
        actions={
          <ButtonLink href={`${ROUTES.admin.enquiries}?status=new`}>
            <Inbox className="size-4" aria-hidden="true" />
            Review new enquiries
          </ButtonLink>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="New enquiries"
          value={newCount}
          hint="Waiting for a first reply"
          icon={Inbox}
        />
        <StatCard
          label="All enquiries"
          value={enquiries.length}
          hint="Most recent 200 shown"
          icon={Users}
        />
        <StatCard
          label="Published products"
          value={publishedProducts}
          hint={`${products.length} in total`}
          icon={Package}
        />
        <StatCard
          label="Published articles"
          value={publishedPosts}
          hint={`${posts.length} in total`}
          icon={BookOpen}
        />
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base">Latest enquiries</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {recent.length === 0 ? (
            <p className="text-muted-foreground px-6 pb-6 text-sm">
              No enquiries yet. They appear here as soon as they arrive.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Service</TableHead>
                  <TableHead className="hidden sm:table-cell">Received</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((enquiry) => (
                  <TableRow key={enquiry.id}>
                    <TableCell className="font-mono text-xs">
                      <a
                        href={`${ROUTES.admin.enquiries}/${enquiry.id}`}
                        className="text-primary font-semibold hover:underline"
                      >
                        {enquiry.reference}
                      </a>
                    </TableCell>
                    <TableCell>{enquiry.full_name}</TableCell>
                    <TableCell className="hidden md:table-cell">{enquiry.service_type}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {formatDateTime(enquiry.created_at)}
                    </TableCell>
                    <TableCell>
                      <EnquiryStatusBadge status={enquiry.status} />
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
