import type { AuState } from '@/constants/business';
import type {
  EnquiryReference,
  EnquirySource,
  EnquiryStatus,
  ServiceType,
} from '@/constants/enquiry';
import type { ServiceIconKey } from '@/constants/icons';

/**
 * Hand-maintained mirror of supabase/migrations. Keep it in sync with the SQL; regenerate with
 * `supabase gen types` once the project is linked and replace this file if the schema drifts.
 */

type Table<Row, OptionalInsertKey extends keyof Row = never> = {
  Row: Row;
  Insert: Omit<Row, OptionalInsertKey> & Partial<Pick<Row, OptionalInsertKey>>;
  Update: Partial<Row>;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      admin_users: Table<
        {
          user_id: string;
          email: string;
          created_at: string;
        },
        'created_at'
      >;
      site_settings: Table<
        {
          id: number;
          business_name: string;
          tagline: string;
          phone: string;
          email: string;
          street_address: string;
          suburb: string;
          state: AuState;
          postcode: string;
          maps_url: string | null;
          facebook_url: string | null;
          instagram_url: string | null;
          hero_heading: string;
          hero_subheading: string;
          announcement_text: string | null;
          announcement_active: boolean;
          opening_hours: string[];
          trust_highlights: string[];
          updated_at: string;
        },
        | 'id'
        | 'tagline'
        | 'maps_url'
        | 'facebook_url'
        | 'instagram_url'
        | 'announcement_text'
        | 'announcement_active'
        | 'opening_hours'
        | 'trust_highlights'
        | 'updated_at'
      >;
      services: Table<
        {
          id: string;
          parent_id: string | null;
          slug: string;
          name: string;
          summary: string;
          description: string;
          highlights: string[];
          icon: ServiceIconKey;
          sort_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        },
        | 'id'
        | 'parent_id'
        | 'summary'
        | 'description'
        | 'highlights'
        | 'icon'
        | 'sort_order'
        | 'is_published'
        | 'created_at'
        | 'updated_at'
      >;
      product_categories: Table<
        {
          id: string;
          slug: string;
          name: string;
          description: string;
          icon: ServiceIconKey;
          sort_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        },
        'id' | 'description' | 'icon' | 'sort_order' | 'is_published' | 'created_at' | 'updated_at'
      >;
      products: Table<
        {
          id: string;
          category_id: string;
          slug: string;
          name: string;
          summary: string;
          description: string;
          price_aud: number | null;
          image_path: string | null;
          is_featured: boolean;
          is_published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        },
        | 'id'
        | 'summary'
        | 'description'
        | 'price_aud'
        | 'image_path'
        | 'is_featured'
        | 'is_published'
        | 'sort_order'
        | 'created_at'
        | 'updated_at'
      >;
      blog_posts: Table<
        {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          body: string;
          cover_image_path: string | null;
          is_published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        },
        | 'id'
        | 'excerpt'
        | 'body'
        | 'cover_image_path'
        | 'is_published'
        | 'published_at'
        | 'created_at'
        | 'updated_at'
      >;
      faqs: Table<
        {
          id: string;
          question: string;
          answer: string;
          sort_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        },
        'id' | 'sort_order' | 'is_published' | 'created_at' | 'updated_at'
      >;
      pages: Table<
        {
          id: string;
          slug: string;
          title: string;
          meta_description: string;
          body: string;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        },
        'id' | 'meta_description' | 'body' | 'is_published' | 'created_at' | 'updated_at'
      >;
      enquiries: Table<
        {
          id: string;
          reference: EnquiryReference;
          source: EnquirySource;
          service_type: ServiceType;
          product_id: string | null;
          full_name: string;
          email: string;
          phone: string;
          device_model: string;
          message: string;
          status: EnquiryStatus;
          admin_notes: string;
          ip_hash: string | null;
          created_at: string;
          updated_at: string;
        },
        | 'id'
        | 'product_id'
        | 'device_model'
        | 'message'
        | 'status'
        | 'admin_notes'
        | 'ip_hash'
        | 'created_at'
        | 'updated_at'
      >;
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
