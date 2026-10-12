-- Lambton Phones & Repairs: starter content taken from the business's current website.
-- Safe to re-run: every insert is idempotent. Review every statement before going live,
-- especially the prices, warranty terms and legal pages, which must be confirmed by the business.

-- ---------------------------------------------------------------------------
-- Site settings
-- ---------------------------------------------------------------------------

insert into public.site_settings (
  id, business_name, tagline, phone, email, street_address, suburb, state, postcode,
  maps_url, facebook_url, instagram_url, hero_heading, hero_subheading,
  announcement_text, announcement_active, opening_hours, trust_highlights
)
values (
  1,
  'Lambton Phones & Repairs',
  'Your brightest choice in repairs',
  '02 4957 8574',
  'lambtonphonesandrepairs@hotmail.com',
  '33 Alma Rd',
  'New Lambton',
  'NSW',
  '2305',
  'https://www.google.com/maps/search/?api=1&query=33+Alma+Rd+New+Lambton+NSW+2305',
  'https://www.facebook.com/lambtonphones/',
  'https://www.instagram.com/lambton_phone_repairs/',
  'Expert device repairs in New Lambton',
  'Phones, tablets, laptops and consoles repaired by certified technicians using genuine parts, with a 3-month warranty on phone repairs.',
  null,
  false,
  array['Monday to Friday: 9 am to 5 pm', 'Saturday: 9 am to 2 pm', 'Sunday: 10 am to 2 pm'],
  array[
    'Same-day service, often in 15 to 20 minutes',
    'Price Beat Guarantee',
    'No Fix, No Fee promise',
    'Free no-risk assessment and quotes',
    'Complimentary charge port cleaning',
    'Walk-ins welcome'
  ]
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Repair services (parents first, then device pages)
-- ---------------------------------------------------------------------------

insert into public.services (slug, name, summary, description, highlights, icon, sort_order, is_published)
values
  (
    'phone-repair',
    'Phone Repair',
    'Screens, batteries, charging ports, cameras, water damage and software fixes for smartphones.',
    'Our technicians diagnose and repair smartphones with genuine parts. Most phone repairs are finished in around 15 to 30 minutes, depending on the model and parts availability. Diagnostics and quotes are free, and if we cannot fix the problem you do not pay.',
    array['Screen replacement', 'Battery replacement', 'Charging port repair', 'Camera repair', 'Water damage treatment', 'Software troubleshooting'],
    'smartphone',
    1,
    true
  ),
  (
    'laptop-repair',
    'Laptop & MacBook Repair',
    'Hardware repairs, software fixes, upgrades and data backup for laptops and MacBooks.',
    'From cracked or flickering screens to slow performance and boot failures, we diagnose and repair Windows and Mac laptops. We back up your data before repairs wherever possible.',
    array['Screen and keyboard replacement', 'Battery and charging fixes', 'Liquid damage clean-up', 'RAM and storage upgrades', 'Virus removal and operating system repair', 'Data backup before repairs'],
    'laptop',
    2,
    true
  ),
  (
    'tablet-repair',
    'Tablet & iPad Repair',
    'Cracked screens, battery replacements and charging issues for iPads and tablets.',
    'Tablets take a lot of daily wear, which means cracked glass, tired batteries and loose charging ports. Our technicians repair screens, batteries, buttons and ports, and restore performance on iPads and other tablets.',
    array['Screen replacement', 'Battery replacement', 'Buttons and port repair', 'Performance restoration'],
    'tablet',
    3,
    true
  ),
  (
    'console-repair',
    'Console Repair',
    'Repairs for gaming consoles and controllers, including HDMI and display faults.',
    'Controller faults, HDMI port damage, display problems and connection issues are all repaired by our technicians so you can get back to gaming sooner.',
    array['Console repairs', 'Controller fixes', 'Display and connection issues', 'HDMI port repair'],
    'gamepad',
    4,
    true
  ),
  (
    'data-recovery',
    'Data Recovery',
    'Recover photos, documents and files from phones, laptops, drives and servers.',
    'When a drive fails or a device stops responding, your files may still be recoverable. We handle hard drives, SSDs, RAID and NAS systems, and mobile devices. Under our no data, no fee guarantee you only pay when we recover your files.',
    array['Hard drive recovery', 'SSD recovery', 'Mobile data recovery', 'Laptop and desktop recovery', 'No data, no fee guarantee'],
    'hard-drive',
    5,
    true
  )
on conflict (slug) do nothing;

insert into public.services (parent_id, slug, name, summary, description, highlights, icon, sort_order, is_published)
values
  (
    (select id from public.services where slug = 'phone-repair'),
    'iphone-repair',
    'iPhone Repair',
    'Screen, battery, charging port, camera and water damage repairs for iPhone models.',
    'Professional iPhone repairs covering screen replacement, battery upgrades, charging port repairs, camera replacement, Face ID repair and water damage treatment.',
    array['Screen replacement', 'Battery replacement', 'Charging port repair', 'Camera repair', 'Water damage treatment', 'Face ID repair', 'Mic and speaker repair', 'Logic board repair'],
    'smartphone',
    1,
    true
  ),
  (
    (select id from public.services where slug = 'phone-repair'),
    'samsung-repair',
    'Samsung Repair',
    'Screen, battery and charging repairs for Samsung Galaxy phones.',
    'Repairs for Samsung Galaxy phones, including cracked screens, weak batteries and faulty charging ports.',
    array['Screen replacement', 'Battery replacement', 'Charging port repair'],
    'smartphone',
    2,
    true
  ),
  (
    (select id from public.services where slug = 'phone-repair'),
    'google-repair',
    'Google Pixel Repair',
    'Screen, battery and charging repairs for Google Pixel phones.',
    'Repairs for Google Pixel phones, including screen replacement, battery replacement and charging port repair.',
    array['Screen replacement', 'Battery replacement', 'Charging port repair'],
    'smartphone',
    3,
    true
  ),
  (
    (select id from public.services where slug = 'phone-repair'),
    'other-repair',
    'Other Phone Brands',
    'Repairs for other smartphone brands. Call us to check your model.',
    'If your phone is not listed above, call the shop and we will confirm whether we can repair it.',
    array['Screen replacement', 'Battery replacement', 'Charging port repair'],
    'smartphone',
    4,
    true
  )
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Accessory categories and products
-- ---------------------------------------------------------------------------

insert into public.product_categories (slug, name, description, icon, sort_order, is_published)
values
  ('protection-solutions', 'Protection Solutions', 'Screen and lens protection for phones, tablets and watches.', 'shield-check', 1, true),
  ('cases-covers', 'Cases & Covers', 'Clear, slim, rugged and wallet cases, plus tablet covers.', 'package', 2, true),
  ('power-charging', 'Power & Charging', 'Cables, wall adapters, wireless chargers and power banks.', 'plug', 3, true),
  ('audio-entertainment', 'Audio & Entertainment', 'Earphones, headphones, Bluetooth speakers and exercise armbands.', 'headphones', 4, true),
  ('car-technology', 'Car Technology', 'Mounts, holders, car chargers and FM transmitters.', 'car', 5, true)
on conflict (slug) do nothing;

insert into public.products (category_id, slug, name, summary, is_featured, is_published, sort_order)
values
  ((select id from public.product_categories where slug = 'protection-solutions'), 'tempered-glass-screen-protector', 'Tempered Glass Screen Protector', 'For smartphones and iPads.', true, true, 1),
  ((select id from public.product_categories where slug = 'protection-solutions'), 'anti-glare-screen-protector', 'Anti-Glare Screen Protector', 'Cuts glare and reflections for outdoor use.', false, true, 2),
  ((select id from public.product_categories where slug = 'protection-solutions'), 'uv-treated-watch-protector', 'UV-Treated Watch Protector', 'For Samsung, Google and Apple Watches.', false, true, 3),
  ((select id from public.product_categories where slug = 'protection-solutions'), 'camera-lens-protector', 'Camera Lens Protector', 'Helps prevent scratches to the rear camera.', false, true, 4),
  ((select id from public.product_categories where slug = 'cases-covers'), 'clear-case', 'Clear Case', 'Shows off your phone while protecting it.', true, true, 1),
  ((select id from public.product_categories where slug = 'cases-covers'), 'slim-case', 'Slim Case', 'Lightweight protection that stays out of the way.', false, true, 2),
  ((select id from public.product_categories where slug = 'cases-covers'), 'sporty-case', 'Sporty Case', 'Grippy, active-friendly protection.', false, true, 3),
  ((select id from public.product_categories where slug = 'cases-covers'), 'hardshell-case', 'Hardshell Case', 'Heavy-duty protection for everyday knocks.', false, true, 4),
  ((select id from public.product_categories where slug = 'cases-covers'), 'wallet-case', 'Wallet Case', 'Card storage built into the case.', false, true, 5),
  ((select id from public.product_categories where slug = 'cases-covers'), 'magsafe-compatible-case', 'MagSafe Compatible Case', 'Works with MagSafe accessories.', false, true, 6),
  ((select id from public.product_categories where slug = 'cases-covers'), 'waterproof-case', 'Waterproof Case', 'For adventures near water.', false, true, 7),
  ((select id from public.product_categories where slug = 'cases-covers'), 'ipad-tablet-cover', 'iPad & Tablet Cover', 'Protective covers for iPads and tablets.', false, true, 8),
  ((select id from public.product_categories where slug = 'power-charging'), 'charging-cable', 'Charging Cable', 'Premium cables for all device types.', false, true, 1),
  ((select id from public.product_categories where slug = 'power-charging'), 'fast-wall-adapter', 'Fast Wall Adapter', 'Fast charging from a wall outlet.', true, true, 2),
  ((select id from public.product_categories where slug = 'power-charging'), 'wireless-charger', 'Wireless Charger', 'Charging pads and stands.', false, true, 3),
  ((select id from public.product_categories where slug = 'power-charging'), 'high-capacity-power-bank', 'High-Capacity Power Bank', 'Charge on the go.', false, true, 4),
  ((select id from public.product_categories where slug = 'power-charging'), 'multi-device-charger', 'Multi-Device Charger', 'Charge several devices at once.', false, true, 5),
  ((select id from public.product_categories where slug = 'audio-entertainment'), 'wireless-earphones', 'Wireless Earphones', 'Wireless earphones for everyday listening.', true, true, 1),
  ((select id from public.product_categories where slug = 'audio-entertainment'), 'wireless-headphones', 'Wireless Headphones', 'Over-ear wireless headphones.', false, true, 2),
  ((select id from public.product_categories where slug = 'audio-entertainment'), 'bluetooth-speaker', 'Bluetooth Speaker', 'Portable Bluetooth speaker.', false, true, 3),
  ((select id from public.product_categories where slug = 'audio-entertainment'), 'exercise-armband', 'Exercise Armband', 'Hands-free carry for active users.', false, true, 4),
  ((select id from public.product_categories where slug = 'car-technology'), 'wireless-charger-car-mount', 'Wireless Charger Car Mount', 'Mounts your phone and charges it wirelessly.', false, true, 1),
  ((select id from public.product_categories where slug = 'car-technology'), 'car-phone-holder', 'Car Phone Holder', 'Standard phone holders and stands.', false, true, 2),
  ((select id from public.product_categories where slug = 'car-technology'), 'fast-car-charger', 'Fast Car Charger', 'Fast charging from the 12V socket.', false, true, 3),
  ((select id from public.product_categories where slug = 'car-technology'), 'fm-transmitter', 'FM Transmitter', 'Stream audio through your car stereo.', false, true, 4),
  ((select id from public.product_categories where slug = 'car-technology'), 'tablet-car-seat-holder', 'Tablet Car Seat Holder', 'Holds a tablet on the car seat.', false, true, 5)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- FAQs (answers restate the business's published website answers)
-- ---------------------------------------------------------------------------

-- Rows are matched on question text because faqs has no unique key. Re-running the seed must not duplicate answers.
insert into public.faqs (question, answer, sort_order, is_published)
select seed.question, seed.answer, seed.sort_order, seed.is_published
from (
values
  ('How much does it cost to fix a phone?', 'Pricing depends on the model and manufacturer. Repairs start from $65 and go up to $500. Call us for exact pricing.', 1, true),
  ('How long does a phone repair take?', 'Most repairs are finished in 15 to 30 minutes. Times vary with the model, how busy we are and parts availability.', 2, true),
  ('What types of phone repairs do you offer?', 'We repair screens, batteries, charging ports, cameras and software issues, plus water damage. Our most common work is on iPhone and iPad, with some Samsung models.', 3, true),
  ('Do I need an appointment?', 'Walk-ins are welcome and appointments are not required. We recommend calling ahead to check availability.', 4, true),
  ('Are repairs covered by a warranty?', 'Yes. Phone repairs carry a 3-month (90 day) warranty, subject to our terms and conditions. Coverage can vary with the type of repair and the parts used, so ask our team for details.', 5, true),
  ('What forms of payment do you accept?', 'We accept cash, debit cards and major credit cards. Payment options can change, so ask when you visit.', 6, true)
) as seed (question, answer, sort_order, is_published)
where not exists (
  select 1 from public.faqs as existing where existing.question = seed.question
);

-- ---------------------------------------------------------------------------
-- Pages (draft legal text: review with the business owner before go-live)
-- ---------------------------------------------------------------------------

insert into public.pages (slug, title, meta_description, body, is_published)
values
  (
    'about',
    'About Lambton Phones & Repairs',
    'Lambton Phones & Repairs is a device repair shop in New Lambton, Newcastle, trusted since 2020.',
    E'Lambton Phones & Repairs has been fixing phones and other devices since 2020. Our shop at 33 Alma Rd, New Lambton, is a walk-in friendly place to get a fast diagnosis and a clear quote.\n\nOur technicians work on smartphones, tablets, laptops, gaming consoles and storage devices. We use genuine parts, we explain the repair before we start, and we will not charge you for a repair that does not work.',
    true
  ),
  (
    'privacy',
    'Privacy Policy',
    'How Lambton Phones & Repairs collects, uses and protects your personal information.',
    E'## What we collect\n\nWhen you request a quote or contact us through this website we collect your name, email address, phone number and the details of your enquiry. We also keep a salted, one-way hash of your IP address to help block spam. We do not store your raw IP address.\n\n## How we use it\n\nWe use your details to respond to your enquiry, prepare a quote and arrange a repair. We do not sell your personal information.\n\n## Where it is stored\n\nEnquiries are stored in a secure cloud database managed by Supabase. Access is limited to authorised staff.\n\n## Your rights\n\nYou can ask us what personal information we hold about you and ask us to correct or update it. Contact us on 02 4957 8574 or at lambtonphonesandrepairs@hotmail.com.\n\n## Complaints\n\nIf you are not satisfied with how we handle your information you can contact the Office of the Australian Information Commissioner (OAIC).',
    true
  ),
  (
    'terms',
    'Terms and Conditions',
    'Terms for using the Lambton Phones & Repairs website and requesting quotes.',
    E'## Using this website\n\nThis website gives general information about our services and products. Information on the site may change without notice.\n\n## Quotes\n\nQuotes requested through this website are estimates only. A repair is confirmed once you agree to the quote in store or over the phone.\n\n## Warranty\n\nPhone repairs carry a 3-month (90 day) warranty. The warranty covers faults caused by the repair we performed. Coverage can vary with the type of repair and the parts used. Ask our team for the full warranty terms before you agree to a repair.\n\n## Limitation of liability\n\nTo the extent permitted by law, we are not liable for indirect or consequential loss arising from the use of this website.',
    true
  )
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Creating the first admin
-- ---------------------------------------------------------------------------
-- 1. In Supabase Dashboard > Authentication > Users, invite or create the admin user.
-- 2. Copy the user's UUID and run (replace the placeholders):
--
--    insert into public.admin_users (user_id, email)
--    values ('<auth-user-uuid>', '<admin-email>')
--    on conflict (user_id) do nothing;

-- ---------------------------------------------------------------------------
-- Blog posts (general repair advice written for the site; review before launch)
-- ---------------------------------------------------------------------------

-- Rows are matched on slug, so re-running the seed leaves existing posts unchanged.

insert into public.blog_posts (slug, title, excerpt, body, cover_image_path, is_published, published_at)
values (
  'battery-signs-phone-needs-replacing',
  'How to tell your phone battery needs replacing',
  'A battery that is wearing out often shows up as fast drain, sudden shutdowns or heat. Here is what to check, and what to do if the phone looks swollen.',
  $body$Phone batteries wear out slowly. Each charge cycle reduces capacity a little, and heat speeds that up. Most people notice the change gradually, so it helps to know which signs point to the battery rather than to the software.

## Signs to look for

The most common sign is a battery that drains faster than it used to. A phone that lasted a full day last year and now needs charging by mid-afternoon may have a tired battery. First check whether one app is using most of the power, because that is a software problem and usually easier to fix.

A more reliable sign is an unexpected shutdown. If the phone switches off at 30 percent, or drops from 20 percent straight to zero, the battery can no longer supply enough power when the phone is under load. This often happens when you open the camera or a game.

Heat is another warning sign. Phones get warm while charging, but a phone that is hot to touch during normal use, or one that becomes very hot on a flat surface while charging, needs attention.

## Check the battery health figure

On an iPhone, open Settings, then Battery, then Battery Health and Charging. The Maximum Capacity figure shows how much of the original capacity remains. A reading under about 80 percent is a good reason to have the battery checked.

Android menus differ by brand and model. Look under Settings, then Battery, for an entry called battery health or battery information. Not every Android phone reports a health percentage, and the numbers are estimates, so use them as a guide rather than an exact measurement.

## If the battery looks swollen

**Stop using the phone and stop charging it** if the back panel is lifting, the screen is pushing away from the frame, or the phone no longer sits flat on a table. A swollen lithium battery can become a fire risk.

Keep the phone away from heat, and do not press on it or try to open it. Do not put it in the household bin. Bring it in for a check and ask how it should be handled. Our technicians can check the battery health and tell you whether a replacement makes sense.

Until someone has checked it, keep the phone off the charger and somewhere cool.$body$,
  'blog/battery-signs-phone-needs-replacing.webp',
  true,
  '2026-09-16T09:00:00Z'
)
on conflict (slug) do nothing;

insert into public.blog_posts (slug, title, excerpt, body, cover_image_path, is_published, published_at)
values (
  'slow-phone-charging-checks',
  'Why your phone charges slowly, and what to check first',
  'Most slow charging comes from the cable, the adapter, the port or the case rather than the battery. Check those first before you assume the phone needs a repair.',
  $body$A phone that charges slowly is frustrating, but the cause is usually something you can check in a few minutes. Start with the parts that connect the phone to the power, and look at the battery only after the simpler causes are ruled out.

## Check the cable and the adapter

A cable has to carry the current the phone asks for. A worn, frayed or bent cable can limit charging speed, and cheap cables are not always built for fast charging. If your phone uses USB-C, check that the cable is rated for the wattage you need.

The adapter matters just as much. A phone can only draw as much power as the adapter supplies. A USB-A port on an older charger usually delivers much less power than a USB-C port that supports power delivery, so a phone that charges quickly on one may be slow on the other. Test with an adapter and cable you know work to see whether the speed changes.

## Clean the charging port

Lint and pocket debris can build up in the port and stop the cable from seating fully. Shine a torch into the port and look for grey fluff or dust.

Clean it with a wooden or plastic toothpick, moving gently and only as far as you need to. Never use a metal tool or a pin, because a metal tip can short the contacts inside the port.

## Wireless charging and cases

Wireless chargers depend on alignment. The phone must sit centred on the charging coil. A case that is too thick, or one with a metal plate, can reduce the power that reaches the battery. Try the charger without the case to see whether the speed changes.

## When to get it checked

An older battery can charge more slowly, and some phones slow charging when the battery is warm or worn. Work through these checks before you assume the battery is the problem:

- **Cable:** swap it for one you know is rated for fast charging.
- **Adapter:** test with a USB-C adapter you trust, rated for the phone.
- **Port:** confirm the cable sits firmly and nothing is trapped inside.
- **Case and charger:** remove the case and centre the phone on the wireless pad.

If the phone still charges slowly with a good cable, a working adapter and a clean port, the battery or the charging hardware may need a closer look. Our technicians can check the port and battery and tell you which part is causing the slow charge.

Change one part at a time and note what changes, so you can explain exactly what you have already tried.$body$,
  'blog/slow-phone-charging-checks.webp',
  true,
  '2026-09-23T09:00:00Z'
)
on conflict (slug) do nothing;

insert into public.blog_posts (slug, title, excerpt, body, cover_image_path, is_published, published_at)
values (
  'water-damage-first-hour',
  'What to do if your phone gets wet',
  'Water damage often gets worse in the hours and days after it happens. Switch the phone off, keep it away from power and heat, and bring it in for a check.',
  $body$Water and phones do not mix, but a quick response helps. Most of the damage happens when a wet phone is switched on, charged or heated, so the first hour matters more than anything you do later.

## Do this straight away

Switch the phone off if it is still on. A powered phone can short out where water has reached the circuit board. If you can remove the case and the SIM tray without force, do so, because water can collect behind both.

Dry the outside gently with a soft cloth, then rest the phone on a dry towel with the charging port facing down so that any water can drain out. Do not keep pressing buttons or switching the phone back on to test it.

## Avoid these common mistakes

Do not plug the phone in or try to charge it, even if it seems to work. Charging a wet phone can cause a short circuit.

Do not open the phone yourself. Pulling it apart exposes the internal parts to more moisture and can break the adhesive and seals that help keep water out.

Do not use a hair dryer or a heater. Heat can damage the screen and battery, and it can push moisture into places where it is harder to remove.

Do not put the phone in a bag of rice. Rice does not remove moisture effectively, and it can leave dust and starch in the port and speaker openings. Leave the phone somewhere dry and airy instead, with the case and SIM tray off if you removed them.

## Watch for delayed damage

Corrosion can take days to show up. The phone may seem fine at first and then develop a crackling speaker or a battery that drains quickly.

If the water was salty, chlorinated or came from a drink, mention it when you bring the phone in. Those liquids can leave residue that makes corrosion more likely.

A water resistance rating such as IP68 describes how the phone performed when it was tested new, under specific conditions. It does not mean the phone is protected against every liquid or every kind of exposure. Cracks, worn seals and a previous drop can all reduce that protection, so treat a rating as a limit rather than a guarantee.

Our technicians can check the phone for moisture and corrosion, even if it appears to work.

Until a technician has checked it, keep the phone switched off and away from chargers.$body$,
  'blog/water-damage-first-hour.webp',
  true,
  '2026-09-30T09:00:00Z'
)
on conflict (slug) do nothing;

insert into public.blog_posts (slug, title, excerpt, body, cover_image_path, is_published, published_at)
values (
  'back-up-before-phone-repair',
  'Back up your phone before any repair',
  'A backup protects your photos and messages if something goes wrong during a repair. Check that it finished, and keep your passcode and account details ready.',
  $body$Many phone repairs keep your data, but a backup is the only reliable protection if something goes wrong. Make a backup before you hand the phone over, and check that it actually finished.

## Back up to iCloud or Google

On an iPhone, open Settings, tap your name, then iCloud, then iCloud Backup. Tap Back Up Now and wait for it to finish. The screen shows the date and time of the last successful backup, so check that it is recent.

On an Android phone, look for Backup in the Google settings or the system settings. Menu names vary by brand and version, but the backup screen should show when it last ran and what it includes.

## Check that everything important is covered

A device backup is not the same as photo sync. iCloud Photos and Google Photos are separate services, and they only keep your photos up to date when they are switched on. Check your photo library in the cloud, or copy the photos to a computer or an external drive.

Messaging apps such as WhatsApp keep their own backups, so check their settings separately. Also note any app that holds codes you need, such as an authenticator app, and make sure you can sign in to it without this phone.

## Know your access details

Know your phone passcode, your Apple ID or Google account email, and the password for that account. Two-step verification codes may be sent to another device, so make sure you can reach it. Keep these details in a password manager rather than on a note attached to the phone.

## What a repair cannot always save

Some data cannot be recovered if the screen is faulty or the board has failed. A backup covers much of what is on the phone, but anything that exists only on the device, such as very recent photos or unsynced messages, may be lost.

A technician may need the phone to switch on and respond so they can test the repair. Ask at drop-off what they need from you, including whether you should turn off Find My or Find My Device first.

Before you hand the phone over, confirm that the backup finished and note the time it completed.$body$,
  'blog/back-up-before-phone-repair.webp',
  true,
  '2026-10-03T09:00:00Z'
)
on conflict (slug) do nothing;

insert into public.blog_posts (slug, title, excerpt, body, cover_image_path, is_published, published_at)
values (
  'screen-protectors-and-cases-explained',
  'Screen protectors and cases: what actually protects your phone',
  'A screen protector guards against scratches and small knocks, and a case only helps if it covers the corners. Here is how to choose both, and what neither can prevent.',
  $body$A screen protector guards against scratches and small knocks, and a case only helps if it covers the corners. Neither one can stop every kind of damage, so it helps to know what each is good at before you buy.

## Tempered glass or film

Tempered glass is a thin sheet of hardened glass. It resists scratches well and can absorb small impacts to the screen. It is firmer and a little thicker than film, so check that it still fits inside your case.

Film is thinner and more flexible. It can be easier to fit on curved screens, but it usually offers less impact protection and marks more easily. Neither type stops a phone from cracking if it lands on a corner.

## Coverage and fit

Check the edge coverage. A protector that only covers the flat centre leaves the curved edges exposed, and many cracks start at the edges. A full-cover protector reaches the edges, but it needs to be designed for your phone's screen shape or it may lift.

Fit matters as much as the product. A protector should sit flat with no gaps at the edges. If it is too big, it can lift when you put the phone in a case.

Choose the protector and the case together. A case with a raised lip around the screen keeps the glass off a flat surface when the phone lands face down.

## What a case has to do

A case only protects if it covers the corners. A thin slip-on case that looks good but has no reinforced corners may do little when the phone lands on an edge. Look for corners made of shock-absorbing material and a lip that stands above the screen.

Choose a case you will keep on. A protective case that you remove every day offers no protection on the day you drop the phone. Check that the buttons and the camera opening are easy to reach, because awkward cutouts often lead people to take a case off.

## When a protector cannot help

A protector cannot stop a drop onto a corner. The force goes into the frame and the glass underneath, and a protector does not change that. The back of the phone is not covered by a screen protector either.

Fitting a protector is a skill. Dust and air bubbles get trapped under a badly fitted protector, and it can be hard to get it straight a second time. Clean the screen with a lint-free cloth, and fit the protector in a dust-free room if you can.

A cracked protector no longer does its job, so replace it as soon as you can.$body$,
  'blog/screen-protectors-and-cases-explained.webp',
  true,
  '2026-10-07T09:00:00Z'
)
on conflict (slug) do nothing;
