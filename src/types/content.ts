import type { Database } from '@/types/database';

type Row<Table extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][Table]['Row'];

export type SiteSettings = Row<'site_settings'>;
export type Service = Row<'services'>;
export type ProductCategory = Row<'product_categories'>;
export type Product = Row<'products'>;
export type BlogPost = Row<'blog_posts'>;
export type Faq = Row<'faqs'>;
export type ContentPage = Row<'pages'>;
export type Enquiry = Row<'enquiries'>;

export interface ProductWithCategory extends Product {
  category: ProductCategory | null;
}

export interface ServiceWithChildren extends Service {
  children: Service[];
}
