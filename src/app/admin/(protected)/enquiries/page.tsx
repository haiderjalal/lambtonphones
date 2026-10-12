import Link from 'next/link';

import { EnquiryStatusBadge } from '@/components/admin/status-badge';
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
import { ENQUIRY_STATUS_LABELS, ENQUIRY_STATUSES, type EnquiryStatus } from '@/constants/enquiry';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { requireAdminPage } from '@/services/admin-auth-service';
import { listEnquiries } from '@/repositories/enquiry-repository';
import { formatDateTime } from '@/utils/format';
import { firstParam } from '@/utils/search-params';

interface EnquiriesPageProps {
  searchParams: Promise<{ status?: string | string[] }>;
}

function parseStatus(value: string | null): EnquiryStatus | null {
  return ENQUIRY_STATUSES.find((status) => status === value) ?? null;
}

export default async function EnquiriesPage({ searchParams }: EnquiriesPageProps) {
  const params = await searchParams;
  const statusFilter = parseStatus(firstParam(params.status));
  const admin = await requireAdminPage();
  const enquiries = await listEnquiries(admin.client, statusFilter);

  const filters: { label: string; value: EnquiryStatus | null }[] = [
    { label: 'All', value: null },
    ...ENQUIRY_STATUSES.map((status) => ({ label: ENQUIRY_STATUS_LABELS[status], value: status })),
  ];

  return (
    <>
      <AdminPageHeader
        title="Enquiries"
        description="Quote requests, contact messages and product enquiries, newest first."
      />

      <nav aria-label="Filter enquiries by status" className="mb-6 flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = filter.value === statusFilter;
          const href = filter.value
            ? `${ROUTES.admin.enquiries}?status=${filter.value}`
            : ROUTES.admin.enquiries;

          return (
            <Link
              key={filter.label}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                isActive
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-brand-ink hover:border-primary/50',
              )}
            >
              {filter.label}
            </Link>
          );
        })}
      </nav>

      <Card>
        <CardContent className="p-0">
          {enquiries.length === 0 ? (
            <p className="text-muted-foreground p-6 text-sm">No enquiries match this filter.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Service</TableHead>
                  <TableHead className="hidden lg:table-cell">Source</TableHead>
                  <TableHead className="hidden sm:table-cell">Received</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enquiries.map((enquiry) => (
                  <TableRow key={enquiry.id}>
                    <TableCell className="font-mono text-xs">
                      <Link
                        href={`${ROUTES.admin.enquiries}/${enquiry.id}`}
                        className="text-primary font-semibold hover:underline"
                      >
                        {enquiry.reference}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="text-brand-ink font-medium">{enquiry.full_name}</div>
                      <div className="text-muted-foreground text-xs">{enquiry.email}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{enquiry.service_type}</TableCell>
                    <TableCell className="hidden capitalize lg:table-cell">
                      {enquiry.source.replace('_', ' ')}
                    </TableCell>
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
