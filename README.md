# Lambton Phones & Repairs

Public website and content management system for Lambton Phones & Repairs, a device repair shop
at 33 Alma Rd, New Lambton NSW 2305.

- **Framework:** Next.js 16 (App Router), React 19, TypeScript (strict)
- **Backend and CMS:** Supabase (PostgreSQL, Auth, Storage) with row level security
- **UI:** Tailwind CSS 4, shadcn/ui, Lucide icons, `next/font` (Fraunces headlines, Geist body), `next/image`
- **Forms:** React Hook Form with Zod, validated in the browser and again on the server
- **Email:** Resend (optional; enquiries are saved even when email is not configured)

## What is included

Public site: home, services and device pages, accessory shop with categories and search, product
pages, blog, about, contact and enquiry form, support and FAQ, privacy and terms.

Admin area (`/admin`, sign-in required): enquiry inbox with status and internal notes, products and
image uploads, categories, repair services and device pages, blog, FAQs, legal and about pages, and
business details (phone, address, hours, links, homepage wording and announcement bar).

See [docs/architecture.md](docs/architecture.md) for how the pieces fit together and
[docs/decisions.md](docs/decisions.md) for the reasoning behind them.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a Supabase project, then apply the schema and starter content. In the SQL editor, run
   `supabase/migrations/20261011000000_initial_cms_schema.sql` first, then `supabase/seed.sql`.
   `supabase db push` applies only the migration, so the seed still has to be run separately.
   Confirm it worked with `select count(*) from public.site_settings;`, which should return 1.

3. Create the first admin. In Supabase Dashboard, go to Authentication, then Users, and create the
   user. Copy the user's UUID and run the statement at the bottom of `supabase/seed.sql`.

4. Copy the environment template and fill in the values:

   ```bash
   cp .env.example .env.local
   ```

   Generate `IP_HASH_SECRET` with `openssl rand -hex 32`. See
   [docs/deployment.md](docs/deployment.md) for what each variable does.

5. Start the development server:

   ```bash
   npm run dev
   ```

   The site runs at http://localhost:3000 and the admin area at http://localhost:3000/admin.

## Scripts

| Command                                   | Purpose                                                                       |
| ----------------------------------------- | ----------------------------------------------------------------------------- |
| `npm run dev`                             | Development server                                                            |
| `npm run build`                           | Production build (type checks and prerenders pages; needs Supabase reachable) |
| `npm run start`                           | Serve the production build                                                    |
| `npm run lint`                            | ESLint                                                                        |
| `npm run typecheck`                       | TypeScript without emitting files                                             |
| `npm test`                                | Unit tests (Vitest)                                                           |
| `npm run format` / `npm run format:check` | Prettier                                                                      |

## Project layout

```
src/
  app/            Routes only: pages, layouts, metadata, route handlers
    (site)/       Public site (header, footer, public pages)
    admin/        Admin login and the protected (protected)/ admin pages
  actions/        Server Actions (validate, authorise, delegate to services)
  components/     Shared UI (ui/ from shadcn, layout/, shared/, home/, shop/, admin/ ...)
  constants/      Routes, enquiry vocabulary, cache tags, icon map, navigation
  hooks/          Client hooks (useActionForm)
  lib/            Integrations: env, logger, Supabase clients, security helpers, SEO, validations
  repositories/   The only code that talks to Supabase tables
  services/       Business rules: enquiries, notifications, uploads, admin auth, public reads
  types/          Database types (mirrors the migration) and shared result types
  utils/          Pure helpers (text, formatting, references, search params)
supabase/
  migrations/     Schema, RLS policies and storage bucket
  seed.sql        Starter content taken from the current website (review before launch)
docs/             Architecture, database, decisions and deployment notes
```

## Quality gates

Before merging, all of these must pass: `npm run typecheck`, `npm run lint`, `npm test`,
`npm run format:check` and `npm run build`.
