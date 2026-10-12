import type { Metadata } from 'next';

import { ContactPanel } from '@/components/contact/contact-panel';
import { QuoteForm } from '@/components/forms/quote-form';
import { PageHeader } from '@/components/shared/page-header';
import { Section } from '@/components/shared/section';
import {
  ENQUIRY_SERVICE_TYPE_BY_SERVICE_SLUG,
  type EnquirySource,
  type ServiceType,
} from '@/constants/enquiry';
import { ROUTES } from '@/constants/routes';
import { CONTACT_BANNER_IMAGE } from '@/constants/site-images';
import { buildPageMetadata } from '@/lib/seo';
import { getProductForEnquiry, getSiteSettings } from '@/services/public-content-service';
import { firstParam } from '@/utils/search-params';

interface ContactPageProps {
  searchParams: Promise<{ product?: string | string[]; service?: string | string[] }>;
}

export const metadata: Metadata = buildPageMetadata({
  title: 'Contact us',
  description:
    'Request a free, no-obligation repair quote or ask about an accessory. Call, email or visit us in New Lambton.',
  path: ROUTES.contact,
});

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const productSlug = firstParam(params.product);
  const serviceSlug = firstParam(params.service);

  const [settings, product] = await Promise.all([
    getSiteSettings(),
    productSlug ? getProductForEnquiry(productSlug) : Promise.resolve(null),
  ]);

  const source: EnquirySource = product
    ? 'product_enquiry'
    : serviceSlug
      ? 'quote_form'
      : 'contact_form';
  const serviceType: ServiceType =
    (serviceSlug ? ENQUIRY_SERVICE_TYPE_BY_SERVICE_SLUG[serviceSlug] : undefined) ??
    (product ? 'Other' : 'Phone Repair');

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={product ? `Enquire about ${product.name}` : 'Get in touch with our team'}
        description="Send your details and we will reply with a clear answer. Calling us is always an option too."
        breadcrumbs={[{ label: 'Home', href: ROUTES.home }, { label: 'Contact' }]}
        image={CONTACT_BANNER_IMAGE}
      />

      <Section>
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <ContactPanel settings={settings} />
          </div>

          <div className="lg:col-span-7">
            <div className="border-border bg-card rounded-lg border p-6 sm:p-8">
              <h2 className="text-brand-ink text-2xl font-normal">
                {product ? 'Tell us about your enquiry' : 'Send us a message'}
              </h2>
              <p className="text-muted-foreground mt-2 mb-8 text-sm">
                Fields marked with a star are required.
              </p>
              <QuoteForm
                key={`${source}-${product?.id ?? serviceType}`}
                source={source}
                defaultServiceType={serviceType}
                productId={product?.id ?? null}
                productName={product?.name}
                submitLabel={product ? 'Send my enquiry' : 'Send message'}
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
