# Database

The database is the source of truth for everything the site shows. The schema lives in
`supabase/migrations/20261011000000_initial_cms_schema.sql`. Starter content lives in
`supabase/seed.sql` and is safe to re-run.

## Tables

| Table                | Purpose                                                                                                                | Public read             | Admin write                      |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------- | -------------------------------- |
| `site_settings`      | Single row (`id = 1`): business details, address, links, homepage wording, announcement, opening hours, promise ribbon | Yes                     | Update only                      |
| `services`           | Repair services. A row with `parent_id` set is a device page under its parent (two levels maximum)                     | Published only          | Yes                              |
| `product_categories` | Groups used to filter the shop                                                                                         | Published only          | Yes                              |
| `products`           | Accessories. `price_aud` is nullable (null shows "Ask for price"). `image_path` points into Storage                    | Published only          | Yes                              |
| `blog_posts`         | Articles. `published_at` is set on first publish and kept                                                              | Published, date reached | Yes                              |
| `faqs`               | Questions shown on the homepage and support page                                                                       | Published only          | Yes                              |
| `pages`              | Long-form pages: about, privacy, terms                                                                                 | Published only          | Yes                              |
| `enquiries`          | Quote, contact and product enquiries, with reference, status, internal notes and hashed IP                             | No                      | Read and update status and notes |
| `admin_users`        | Who may use the admin area (one row per Supabase Auth user)                                                            | Own row only            | Managed in SQL                   |

Every table has `created_at` and `updated_at` (`updated_at` is maintained by a trigger, UTC).
Primary keys are UUIDs. Status-like fields use check constraints, not free text.

## Row level security

- RLS is enabled on every table.
- Public policies (`anon`, `authenticated`) return published rows only. Blog posts also need
  `published_at <= now()`.
- Admin policies use `(select public.is_admin())`, a security definer function that checks
  `admin_users` for `auth.uid()`.
- `enquiries` has **no** insert policy for public roles. Inserts happen only from the server using
  the service role, after the honeypot and rate-limit checks.
- Grants are narrowed as well as policies: `anon` has no access to enquiries or admin users, and
  `delete` is revoked on content tables. Content is archived with `is_published = false`.

## Storage

- Bucket `site-media`: public read, 5 MB limit, JPEG, PNG, WebP and AVIF only.
- Object policies allow anyone to read and only admins to write, replace or remove objects.
- Paths follow `products/<uuid>.<ext>` or `blog/<uuid>.<ext>`. The application validates the
  pattern before saving a record.

## Migrations and seed

- Schema changes are new files in `supabase/migrations`, named with a timestamp. Do not edit an
  applied migration.
- `seed.sql` skips rows that already exist (matched by id, by slug, or by question for FAQs), so it can be re-run safely. Review its content before
  launch. The prices, warranty terms, FAQ answers and legal pages must be confirmed by the business.
- The first admin is created in Supabase Auth and then linked with the statement at the end of
  `seed.sql`.

## Verification performed

The migration and seed were executed on PostgreSQL 18 (PGlite) with `anon` and `authenticated`
roles, an auth stub and a storage stub. Thirteen checks passed, covering seed counts, anonymous
reads, RLS filtering of drafts, blocked enquiry reads and writes, blocked admin reads, check
constraints, the single-row settings rule, and admin and non-admin write behaviour.
