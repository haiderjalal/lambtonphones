# Decisions, trade-offs and open items

Each decision lists the reasoning and the main alternative, so it can be revisited with the owner.

## Stack

**Next.js 16 App Router with Supabase as the CMS.** Required by the brief. Server Components keep
most of the site free of client JavaScript, and Supabase provides the database, auth and storage
with row level security.

**shadcn/ui and Tailwind 4.** Components are copied into the repository, so they can be changed
freely. Tokens live in `src/styles/globals.css`, so the whole brand can be re-themed in one place.

**Editorial typography and a warm palette.** Headlines use Fraunces, a soft serif, and body text uses
Geist, both loaded with `next/font`. The site sits on a warm paper background with deep green actions
and near-black ink. Gradient text, blurred glow shapes, grid textures and coloured shadows were removed
because they read as generic. Colours and fonts live in `src/styles/globals.css`.

**Motion is CSS first.** Headline words rise from a mask, photos drift as they scroll, and images
reveal on entry. Scroll-linked effects use `animation-timeline: view()` behind a feature check, so
browsers without support show the static layout. Reduced-motion rules are set per element, not with a
global duration override.

**No animation library.** Scroll reveal, counters and the hero motion are built with CSS and a
small IntersectionObserver. This keeps the bundle small. Framer Motion would add roughly 30 KB of
JavaScript for effects that CSS already covers.

## Data and content

**Accessories are a catalogue with enquiries, not a cart.** The current website shows accessory
categories without prices and has no checkout. The brief asks for a replica, so the shop lists
products and each one has an enquiry button. A cart would need pricing, stock and payment decisions
that the owner has not made. Prices are optional in the CMS, and empty prices show "Ask for price".

**Repair services use a parent/child table** (`services.parent_id`). This keeps the original
URL structure (`/phone-repair/iphone-repair`) and lets the owner add device pages from the CMS.
The hierarchy is limited to two levels, enforced in the server action.

**Starter content is taken from the current site, not invented.** Facts such as the address,
phone, hours, services, accessory categories and FAQ answers are copied (in original wording). Items
that could not be verified were left out (see the list below).

**Caching uses tags and explicit invalidation.** Each admin save expires only the affected tags,
then refreshes the layout. A one-hour revalidation is the fallback. This keeps the site fast
without a rebuild after every edit.

## Security

**The enquiry insert uses the service role, and nothing else does.** Public visitors cannot write
to the table even with the anon key. The alternative, an anonymous insert policy, would let anyone
bypass the honeypot and rate limit by calling the API directly.

**Rate limiting is stored in the database, not in memory.** On serverless hosting each instance has
its own memory, so an in-memory limit would be easy to bypass. The count uses the enquiry rows
themselves, keyed by an HMAC of the IP. No extra table is needed.

**Anti-spam uses a honeypot and a rate limit, not a CAPTCHA.** This is the least intrusive option
that works. Add Cloudflare Turnstile if spam becomes a problem.

**The Content-Security-Policy keeps `'unsafe-inline'` for scripts.** Next.js inlines small bootstrap
scripts. A nonce-based policy would require every page to render per request, which would remove
static caching. Cross-site scripting is mitigated by React's escaping, the absence of
`dangerouslySetInnerHTML` from user content, and Markdown rendering with raw HTML disabled. The
only `dangerouslySetInnerHTML` is for JSON-LD, which is escaped.

**Admin access is enforced twice.** The proxy checks for a session, and every protected page and
action checks the `admin_users` table. Row level security checks again on each write. A user who
is signed in but not an admin is blocked at each layer.

**Supabase Auth rate-limits sign-in attempts.** This project does not add a second limit on the
admin login. Enable multi-factor authentication in Supabase for admin accounts before launch.

## Open items and known limits

- **Admin flows are not yet exercised end to end.** The local test harness does not implement
  Supabase Auth or Storage, so sign-in, uploads and admin saves were covered by the database checks
  and type checking, not by a browser run. Test them against a real Supabase project before go-live.
- **Build requires Supabase.** `next build` prerenders pages from the database, so the build fails if
  Supabase is unreachable. This is intentional, so a broken content source cannot ship silently.
- **Unused `cn` npm package.** The shadcn CLI added an unrelated npm package named `cn` to
  `package.json`. The components now import the project's own helper from `@/lib/utils`, so the
  package is unused and can be removed with `npm uninstall cn`. It was left in place for review.
- **Stats on the homepage are constants.** The four figures in `components/home/stats-section.tsx`
  mirror the FAQ answers. Move them to `site_settings` if they change often.
- **Uploaded images are not deleted when replaced.** The old file stays in storage. Add a cleanup job
  if storage cost matters.
- **No automated end-to-end tests.** Vitest covers validation, formatting, text, security helpers
  and the enquiry reference generator. Playwright is the planned next step.

## Content to confirm before launch

These items come from the current website and may need correcting. The owner must confirm them.

- **Blog articles:** the five starter articles are general repair advice written for the site, not
  taken from the current website. They are live now, so review them, or unpublish any the owner does
  not want, before launch.
- **Warranty:** 3 months (90 days) on phone repairs. Check the full terms.
- **Pricing:** repairs "start from $65 and go up to $500". Confirm the range.
- **Promises:** same-day service in 15 to 20 minutes, Price Beat Guarantee, No Fix No Fee,
  free no-risk assessment, complimentary charge port clean, genuine parts, walk-ins welcome.
- **Data recovery:** "no data, no fee" is stated on the current site. Confirm before publishing.
- **Brand coverage:** the FAQ says the shop mainly services iPhone and iPad, with some Samsung
  models. The site also lists Google, Other, laptop, tablet and console repairs. Confirm which
  models are supported.
- **Experience:** the current site says "since 2020" in one place and "over a decade" in another.
  This rebuild uses "since 2020". Confirm the date.
- **Coverage area:** the current site describes nationwide service. The shop is local to New
  Lambton. This rebuild describes local walk-in service only. Add any mail-in or regional offers
  deliberately.
- **Claims not carried over:** the current site's testimonials appear to be placeholders, so they
  were left out. The "Class 100 cleanroom" claim was also left out. Add verified reviews and
  equipment claims only if they can be evidenced.
- **Legal pages:** the privacy policy and terms are drafts. The privacy policy describes how this
  site handles data. Have both reviewed before they go live.
- **Logo and photography:** the logo is a placeholder mark. The photos are free stock images from
  Unsplash (listed in [media-credits.md](media-credits.md)) and show generic repairs, not this shop.
  Replace them with the business's own photos before launch, and upload official logo assets through
  the CMS or replace `src/components/layout/logo.tsx`.
- **Social links:** Facebook and Instagram addresses were taken from the current site.

## Suggested next steps

1. Create the Supabase project, apply the migration and seed, and test the admin area.
2. Connect Resend (`RESEND_API_KEY`, `ENQUIRY_NOTIFY_EMAIL`, `ENQUIRY_FROM_EMAIL`) and check a
   verified sender domain.
3. Add Playwright end-to-end tests for the enquiry journey and the admin save flow.
4. Consider a WhatsApp notification (Meta Cloud API) once the business confirms it wants one.
