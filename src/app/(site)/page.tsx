import { CtaSection } from '@/components/home/cta-section';
import { FaqSection } from '@/components/home/faq-section';
import { FeaturedProductsSection } from '@/components/home/featured-products-section';
import { GuaranteesSection } from '@/components/home/guarantees-section';
import { HeroSection } from '@/components/home/hero-section';
import { QuoteSection } from '@/components/home/quote-section';
import { ServicesSection } from '@/components/home/services-section';
import { StatsSection } from '@/components/home/stats-section';
import { TrustRibbon } from '@/components/home/trust-ribbon';
import { WorkshopGallerySection } from '@/components/home/workshop-gallery-section';
import { JsonLd } from '@/components/shared/json-ld';
import { SITE_DEFAULT_DESCRIPTION } from '@/constants/site';
import { buildLocalBusinessJsonLd, buildPageMetadata } from '@/lib/seo';
import { getHomePageData } from '@/services/public-content-service';

export const metadata = buildPageMetadata({
  title: 'Device repairs in New Lambton, Newcastle',
  description: SITE_DEFAULT_DESCRIPTION,
  path: '/',
});

export default async function HomePage() {
  const { settings, services, featuredProducts, faqs } = await getHomePageData();

  return (
    <>
      <JsonLd data={buildLocalBusinessJsonLd(settings)} />
      <HeroSection settings={settings} />
      <TrustRibbon items={settings.trust_highlights} />
      <StatsSection />
      <ServicesSection services={services} />
      <WorkshopGallerySection />
      <QuoteSection />
      <GuaranteesSection />
      <FeaturedProductsSection products={featuredProducts} />
      <FaqSection faqs={faqs} />
      <CtaSection settings={settings} />
    </>
  );
}
