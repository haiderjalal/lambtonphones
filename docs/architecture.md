# Architecture

## Request flow

```
Browser
  │
  ▼
Route (app/)          thin: params, metadata, composes components
  │
  ▼
Component             presentational; client components only where interaction needs them
  │  (forms)
  ▼
Server Action         actions/: validates input with the shared Zod schema, checks the admin
  │                   session, delegates to a service, returns an ActionResult
  ▼
Service               services/: business rules (rate limiting, honeypot, notifications,
  │                   uploads, admin mutation pipeline, public read facade)
  ▼
Repository            repositories/: the only code that queries Supabase tables
  │
  ▼
Supabase              PostgreSQL with row level security, Auth and Storage
```

Components never query the database. Routes never contain business rules.

## Public reads and caching

- Public pages use the **anonymous** Supabase client, which never reads cookies. Pages are
  therefore static or cached, and row level security limits them to published rows.
- Repository reads are wrapped in `unstable_cache` with **tags** (`src/constants/cache.ts`).
- Admin writes call `runAdminMutation`, which invalidates the affected tags with `updateTag`
  (read-your-writes) and then `revalidatePath('/', 'layout')` so prerendered pages refresh.
- A one-hour `revalidate` acts as a safety net if an invalidation is ever missed.
- Pages are prerendered at build time (`generateStaticParams` for services, device pages, products
  and articles). Unknown slugs are rendered on demand and then cached.

## Admin area

- `src/proxy.ts` refreshes the Supabase session cookie and redirects signed-out visitors from
  `/admin` to `/admin/login`. This is a fast first gate only.
- `requireAdminPage()` (in `services/admin-auth-service.ts`) is called by every protected page and
  layout. It confirms the signed-in user has a row in `admin_users`. The result is cached per
  request with React's `cache()`.
- Every admin write goes through `runAdminMutation`, which validates, checks the admin session,
  writes through the **cookie-bound** client (so row level security also applies) and logs the
  outcome.
- Admin routes send `X-Robots-Tag: noindex` and `Cache-Control: private, no-store`.

## Public enquiry flow

1. The quote, contact or product form validates in the browser with React Hook Form and Zod.
2. `submitEnquiryAction` validates the same schema on the server.
3. `submitEnquiry` (service) checks the hidden honeypot field. Bots receive a success response
   but nothing is stored.
4. The client IP is HMAC-hashed with `IP_HASH_SECRET`. The enquiry count for that hash in the last
   15 minutes is compared with the limit (`src/constants/business.ts`).
5. The enquiry is inserted with the **service role** (the only code path that does this). It gets a
   customer reference such as `LP-7K2Q9D4M`.
6. A plain-text notification is sent through Resend with a timeout and one retry. Failure is logged
   and does not fail the customer's submission. If email is not configured, this step is skipped and
   logged.

## Security controls

| Control                                                                                   | Where                                                          |
| ----------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Row level security on every table; anon reads published rows only                         | `supabase/migrations`                                          |
| No anonymous write or read access to enquiries; no delete grants (content is archived)    | migration grants and policies                                  |
| Admin role checked in SQL (`is_admin()`, security definer, fixed search path) and in code | migration, `admin-auth-service.ts`                             |
| Server-side validation of every form with the same schema as the browser                  | `src/lib/validations`                                          |
| Control characters stripped from free text; URLs limited to https; media paths validated  | `validations/common.ts`                                        |
| Image uploads checked by size and magic bytes; names generated server-side                | `services/media-service.ts`, `lib/security/image-signature.ts` |
| Honeypot and per-IP rate limit on the public enquiry form                                 | `services/enquiry-service.ts`                                  |
| Keyed hash of IP addresses; raw addresses are never stored                                | `lib/security/ip-hash.ts`                                      |
| Service role key used only in `service-client.ts` and `enquiry-repository.ts`             | `lib/supabase`                                                 |
| Environment validated at startup; secrets are server-only (`server-only` package)         | `lib/env`                                                      |
| Content-Security-Policy, HSTS, nosniff, frame denial, Referrer and Permissions policies   | `next.config.ts`                                               |
| Markdown renders without raw HTML; images in Markdown are removed                         | `components/shared/markdown-content.tsx`                       |
| Error pages and server actions never expose stack traces or database messages             | `app/error.tsx`, `lib/logger.ts`                               |

## Performance

- Server Components by default. Client JavaScript is limited to the mobile menu, the forms, the
  scroll reveal, the counters and the admin forms.
- FAQs use native `<details>`, so they work with no JavaScript.
- Category filters and search are plain GET forms, so they work with no JavaScript.
- Images use `next/image` with AVIF and WebP formats. Fonts use `next/font` with `display: swap`.
- Animations are CSS and only transform and opacity. They are disabled under
  `prefers-reduced-motion`.

## Folder conventions

- One responsibility per file. Route files stay small.
- Named exports; no default exports except pages, layouts and Next file conventions.
- Business logic lives in `services/`. UI code calls services through server actions or through the
  public content facade (`services/public-content-service.ts`).
- New database fields need a migration, a `database.ts` update, a repository mapping, a validation
  schema and, if editable, a form. Keep these in step.
