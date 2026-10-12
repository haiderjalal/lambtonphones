import Link from 'next/link';
import { notFound } from 'next/navigation';

import { EnquiryTriageForm } from '@/components/admin/enquiry-triage-form';
import { EnquiryStatusBadge } from '@/components/admin/status-badge';
import { AdminPageHeader } from '@/components/admin/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES, productHref } from '@/constants/routes';
import { requireAdminPage } from '@/services/admin-auth-service';
import { getEnquiryById } from '@/repositories/enquiry-repository';
import { getProductById } from '@/repositories/product-repository';
import { formatDateTime, toTelHref } from '@/utils/format';

interface EnquiryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EnquiryDetailPage({ params }: EnquiryDetailPageProps) {
  const { id } = await params;
  const admin = await requireAdminPage();
  const enquiry = await getEnquiryById(admin.client, id);

  if (!enquiry) notFound();

  const product = enquiry.product_id
    ? await getProductById(admin.client, enquiry.product_id)
    : null;

  return (
    <>
      <AdminPageHeader
        title={`Enquiry ${enquiry.reference}`}
        description={`Received ${formatDateTime(enquiry.created_at)}`}
        actions={
          <Link
            href={ROUTES.admin.enquiries}
            className="text-primary self-center text-sm font-semibold hover:underline"
          >
            Back to enquiries
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="grid content-start gap-6 xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customer</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Detail label="Name" value={enquiry.full_name} />
              <Detail
                label="Phone"
                value={
                  <a
                    href={toTelHref(enquiry.phone)}
                    className="text-primary font-medium hover:underline"
                  >
                    {enquiry.phone}
                  </a>
                }
              />
              <Detail
                label="Email"
                value={
                  <a
                    href={`mailto:${enquiry.email}`}
                    className="text-primary font-medium break-all hover:underline"
                  >
                    {enquiry.email}
                  </a>
                }
              />
              <Detail label="Device and model" value={enquiry.device_model || 'Not provided'} />
              <Detail label="Service type" value={enquiry.service_type} />
              <Detail label="Enquiry type" value={enquiry.source.replace('_', ' ')} />
              {product ? (
                <Detail
                  label="Product"
                  value={
                    <Link
                      href={productHref(product.slug)}
                      className="text-primary font-medium hover:underline"
                    >
                      {product.name}
                    </Link>
                  }
                />
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Message</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
                {enquiry.message || 'No message was included with this enquiry.'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid content-start gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Current status</CardTitle>
            </CardHeader>
            <CardContent>
              <EnquiryStatusBadge status={enquiry.status} />
            </CardContent>
          </Card>
          <EnquiryTriageForm
            enquiryId={enquiry.id}
            status={enquiry.status}
            adminNotes={enquiry.admin_notes}
          />
        </div>
      </div>
    </>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
        {label}
      </dt>
      <dd className="text-brand-ink mt-1 text-sm">{value}</dd>
    </div>
  );
}
