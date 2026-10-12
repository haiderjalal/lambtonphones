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
import { listAllFaqs } from '@/repositories/content-repository';

export default async function AdminFaqsPage() {
  const admin = await requireAdminPage();
  const faqs = await listAllFaqs(admin.client);

  return (
    <>
      <AdminPageHeader
        title="FAQs"
        description="Questions shown on the homepage and the support page."
        actions={
          <ButtonLink href={`${ROUTES.admin.faqs}/new`}>
            <Plus className="size-4" aria-hidden="true" />
            New question
          </ButtonLink>
        }
      />

      <Card>
        <CardContent className="p-0">
          {faqs.length === 0 ? (
            <p className="text-muted-foreground p-6 text-sm">No questions yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead className="hidden sm:table-cell">Order</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqs.map((faq) => (
                  <TableRow key={faq.id}>
                    <TableCell>
                      <Link
                        href={`${ROUTES.admin.faqs}/${faq.id}`}
                        className="text-primary font-semibold hover:underline"
                      >
                        {faq.question}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{faq.sort_order}</TableCell>
                    <TableCell>
                      <PublishBadge isPublished={faq.is_published} />
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
