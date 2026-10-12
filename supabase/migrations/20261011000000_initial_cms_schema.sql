-- Lambton Phones & Repairs: initial CMS schema.
-- Covers content tables, enquiries, admin access control (RLS) and the public media bucket.
-- Apply with `supabase db push`, or paste the file into the SQL editor of a new project.

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Admin access
-- ---------------------------------------------------------------------------

-- Admins are granted by inserting their Supabase Auth user id here (see supabase/seed.sql).
-- Rows cannot be inserted or changed through the API, which prevents privilege escalation.
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null check (char_length(email) between 3 and 320),
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create policy "Admins can read their own admin record"
  on public.admin_users
  for select
  to authenticated
  using (user_id = (select auth.uid()));

revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;

-- Security definer lets RLS policies ask "is this user an admin?" without exposing admin_users.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users as au
    where au.user_id = (select auth.uid())
  );
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- Site settings (single row)
-- ---------------------------------------------------------------------------

create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  business_name text not null check (char_length(business_name) between 2 and 120),
  tagline text not null default '' check (char_length(tagline) <= 160),
  phone text not null check (char_length(phone) between 6 and 30),
  email text not null check (char_length(email) between 3 and 254 and email like '%_@_%'),
  street_address text not null check (char_length(street_address) between 3 and 120),
  suburb text not null check (char_length(suburb) between 2 and 80),
  state text not null check (state in ('ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA')),
  postcode text not null check (postcode ~ '^[0-9]{4}$'),
  maps_url text check (maps_url is null or maps_url ~ '^https://'),
  facebook_url text check (facebook_url is null or facebook_url ~ '^https://'),
  instagram_url text check (instagram_url is null or instagram_url ~ '^https://'),
  hero_heading text not null check (char_length(hero_heading) between 4 and 140),
  hero_subheading text not null check (char_length(hero_subheading) between 4 and 400),
  announcement_text text check (announcement_text is null or char_length(announcement_text) <= 200),
  announcement_active boolean not null default false,
  opening_hours text[] not null default '{}',
  trust_highlights text[] not null default '{}',
  updated_at timestamptz not null default now(),
  constraint site_settings_announcement_requires_text
    check (not announcement_active or announcement_text is not null)
);

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Repair services (top-level services with optional device pages as children)
-- ---------------------------------------------------------------------------

create table public.services (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.services (id) on delete restrict,
  slug text not null unique check (char_length(slug) <= 80 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 2 and 120),
  summary text not null default '' check (char_length(summary) <= 240),
  description text not null default '' check (char_length(description) <= 5000),
  highlights text[] not null default '{}',
  icon text not null default 'wrench' check (
    icon in (
      'smartphone', 'laptop', 'tablet', 'gamepad', 'hard-drive', 'shield-check', 'plug',
      'headphones', 'car', 'wrench', 'battery', 'camera', 'speaker', 'sparkles', 'package'
    )
  ),
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint services_not_own_parent check (parent_id is distinct from id)
);

create index services_parent_id_idx on public.services (parent_id);
create index services_listing_idx on public.services (is_published, sort_order);

create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Accessory catalogue
-- ---------------------------------------------------------------------------

create table public.product_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (char_length(slug) <= 80 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 2 and 120),
  description text not null default '' check (char_length(description) <= 240),
  icon text not null default 'package' check (
    icon in (
      'smartphone', 'laptop', 'tablet', 'gamepad', 'hard-drive', 'shield-check', 'plug',
      'headphones', 'car', 'wrench', 'battery', 'camera', 'speaker', 'sparkles', 'package'
    )
  ),
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index product_categories_listing_idx on public.product_categories (is_published, sort_order);

create trigger product_categories_set_updated_at
  before update on public.product_categories
  for each row execute function public.set_updated_at();

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.product_categories (id) on delete restrict,
  slug text not null unique check (char_length(slug) <= 80 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 2 and 120),
  summary text not null default '' check (char_length(summary) <= 240),
  description text not null default '' check (char_length(description) <= 5000),
  price_aud numeric(10, 2) check (price_aud is null or price_aud >= 0),
  image_path text check (image_path is null or char_length(image_path) <= 300),
  is_featured boolean not null default false,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_id_idx on public.products (category_id);
create index products_listing_idx on public.products (is_published, is_featured, sort_order);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Blog, FAQs and long-form pages
-- ---------------------------------------------------------------------------

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (char_length(slug) <= 120 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 2 and 160),
  excerpt text not null default '' check (char_length(excerpt) <= 300),
  body text not null default '' check (char_length(body) <= 50000),
  cover_image_path text check (cover_image_path is null or char_length(cover_image_path) <= 300),
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_posts_published_at_required check (not is_published or published_at is not null)
);

create index blog_posts_listing_idx on public.blog_posts (is_published, published_at desc);

create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null check (char_length(question) between 5 and 240),
  answer text not null check (char_length(answer) between 1 and 2000),
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index faqs_listing_idx on public.faqs (is_published, sort_order);

create trigger faqs_set_updated_at
  before update on public.faqs
  for each row execute function public.set_updated_at();

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (char_length(slug) <= 80 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 2 and 120),
  meta_description text not null default '' check (char_length(meta_description) <= 160),
  body text not null default '' check (char_length(body) <= 50000),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger pages_set_updated_at
  before update on public.pages
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Enquiries (quote requests, contact messages and product enquiries)
-- ---------------------------------------------------------------------------

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique check (reference ~ '^LP-[A-Z0-9]{8}$'),
  source text not null check (source in ('quote_form', 'contact_form', 'product_enquiry')),
  service_type text not null check (
    service_type in (
      'Phone Repair', 'Laptop Repair', 'Tablet Repair', 'Console Repair',
      'Data Recovery', 'Screen Replacement', 'Other'
    )
  ),
  product_id uuid references public.products (id) on delete set null,
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null check (char_length(email) between 3 and 254 and email like '%_@_%'),
  phone text not null check (char_length(phone) between 6 and 30),
  device_model text not null default '' check (char_length(device_model) <= 120),
  message text not null default '' check (char_length(message) <= 2000),
  status text not null default 'new' check (
    status in ('new', 'contacted', 'quoted', 'booked', 'completed', 'closed')
  ),
  admin_notes text not null default '' check (char_length(admin_notes) <= 4000),
  -- Only a keyed hash of the requester IP is stored; the raw address is never persisted.
  ip_hash text check (ip_hash is null or char_length(ip_hash) = 64),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index enquiries_created_at_idx on public.enquiries (created_at desc);
create index enquiries_status_idx on public.enquiries (status, created_at desc);
create index enquiries_ip_hash_idx on public.enquiries (ip_hash, created_at desc);

create trigger enquiries_set_updated_at
  before update on public.enquiries
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.site_settings enable row level security;
alter table public.services enable row level security;
alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.blog_posts enable row level security;
alter table public.faqs enable row level security;
alter table public.pages enable row level security;
alter table public.enquiries enable row level security;

-- Public reads: only data that is meant to be published.
create policy "Public can read site settings"
  on public.site_settings for select to anon, authenticated using (true);

create policy "Public can read published services"
  on public.services for select to anon, authenticated using (is_published);

create policy "Public can read published product categories"
  on public.product_categories for select to anon, authenticated using (is_published);

create policy "Public can read published products"
  on public.products for select to anon, authenticated using (is_published);

create policy "Public can read published blog posts"
  on public.blog_posts for select to anon, authenticated
  using (is_published and published_at <= now());

create policy "Public can read published faqs"
  on public.faqs for select to anon, authenticated using (is_published);

create policy "Public can read published pages"
  on public.pages for select to anon, authenticated using (is_published);

-- Admin writes: full control of content tables.
create policy "Admins manage services"
  on public.services for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admins manage product categories"
  on public.product_categories for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admins manage products"
  on public.products for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admins manage blog posts"
  on public.blog_posts for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admins manage faqs"
  on public.faqs for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admins manage pages"
  on public.pages for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admins update site settings"
  on public.site_settings for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- Enquiries: admins can read and triage. Inserts happen only through the server (service role),
-- which applies validation and rate limiting. There is deliberately no anon insert policy.
create policy "Admins read enquiries"
  on public.enquiries for select to authenticated
  using ((select public.is_admin()));

create policy "Admins update enquiries"
  on public.enquiries for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

revoke all on public.enquiries from anon, authenticated;
grant select, update on public.enquiries to authenticated;

-- Content is archived (is_published = false) rather than deleted, so no delete grants are given.
revoke delete on public.services, public.product_categories, public.products,
  public.blog_posts, public.faqs, public.pages, public.site_settings
  from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Media storage (product photos, blog covers)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "Anyone can read site media"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'site-media');

create policy "Admins can upload site media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'site-media' and (select public.is_admin()));

create policy "Admins can replace site media"
  on storage.objects for update to authenticated
  using (bucket_id = 'site-media' and (select public.is_admin()))
  with check (bucket_id = 'site-media' and (select public.is_admin()));

create policy "Admins can remove site media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'site-media' and (select public.is_admin()));
