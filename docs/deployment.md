# Deployment

The site is designed for Vercel with a Supabase project. Nothing is deployed from this repository
yet.

## 1. Supabase

1. Create a project in the Supabase dashboard. Choose an Australian region for lower latency.
2. Apply `supabase/migrations/20261011000000_initial_cms_schema.sql` (SQL editor, or
   `supabase db push` after `supabase link`).
3. Run `supabase/seed.sql`. The build fails until this has been done (see Troubleshooting). Review the content first (see
   [decisions.md](decisions.md#content-to-confirm-before-launch)).
4. Under Authentication, enable email sign-in and turn on multi-factor authentication for admins.
5. Create the admin user, then link it with the statement at the end of `seed.sql`.
6. Under Authentication, set the Site URL to the production domain and add the admin login URL to
   the allowed redirect URLs.

## 2. Vercel

1. Import the repository from GitHub. The framework preset is Next.js.
2. Add these environment variables for **Production** (and Preview, if used):

| Variable                        | Public | Notes                                                                             |
| ------------------------------- | ------ | --------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | Yes    | Canonical origin, for example `https://www.example.com.au`                        |
| `NEXT_PUBLIC_SUPABASE_URL`      | Yes    | Project URL                                                                       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes    | Anon (public) key. Safe for the browser, and row level security protects the data |
| `SUPABASE_SERVICE_ROLE_KEY`     | **No** | Server only. Bypasses row level security. Never prefix with `NEXT_PUBLIC_`        |
| `IP_HASH_SECRET`                | **No** | At least 32 random characters. Changing it resets the rate-limit counts           |
| `RESEND_API_KEY`                | **No** | Optional. Enables email notifications                                             |
| `ENQUIRY_NOTIFY_EMAIL`          | **No** | Optional. Address that receives new enquiries                                     |
| `ENQUIRY_FROM_EMAIL`            | **No** | Optional. Sender on a domain verified in Resend                                   |

3. Deploy. The build prerenders pages from Supabase, so Supabase must be reachable from Vercel.

## 3. Domain and checks

- Point the domain at Vercel and confirm HTTPS. The site sends HSTS in production.
- `/api/health` returns `{"status":"ok"}` for uptime monitoring.
- Check `/sitemap.xml` and `/robots.txt`. The admin area is disallowed for crawlers.
- Submit a test enquiry. Confirm the row appears in the admin inbox and, if configured, the email
  arrives.
- Run Lighthouse on the homepage, a service page and a product page. Target 95 or higher.

## 4. Rollback

Vercel keeps previous deployments. Promote the last good one from the dashboard. Database
migrations are forward-only, so roll back schema changes with a new migration rather than editing an
applied one.

## Troubleshooting

**Build fails with "The site_settings table has no starter row".** Either the seed has not been run in
this Supabase project, or row level security is hiding the row from the anon key. In the SQL Editor:

1. Run `select count(*) from public.site_settings;`. It should return 1. If it returns 0, run
   `supabase/seed.sql` and rebuild.
2. If it returns 1, check the public read policy with
   `select policyname from pg_policies where tablename = 'site_settings';`. The result should include
   `Public can read site settings`. If it is missing, run this statement from the migration file:

```sql
create policy "Public can read site settings"
  on public.site_settings for select to anon, authenticated using (true);
```

## Local development

```bash
cp .env.example .env.local   # then fill in the values
npm run dev
```

Use a separate Supabase project for development. Never point local development at production data.
