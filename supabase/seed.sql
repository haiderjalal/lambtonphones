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

insert into public.faqs (question, answer, sort_order, is_published)
values
  ('How much does it cost to fix a phone?', 'Pricing depends on the model and manufacturer. Repairs start from $65 and go up to $500. Call us for exact pricing.', 1, true),
  ('How long does a phone repair take?', 'Most repairs are finished in 15 to 30 minutes. Times vary with the model, how busy we are and parts availability.', 2, true),
  ('What types of phone repairs do you offer?', 'We repair screens, batteries, charging ports, cameras and software issues, plus water damage. Our most common work is on iPhone and iPad, with some Samsung models.', 3, true),
  ('Do I need an appointment?', 'Walk-ins are welcome and appointments are not required. We recommend calling ahead to check availability.', 4, true),
  ('Are repairs covered by a warranty?', 'Yes. Phone repairs carry a 3-month (90 day) warranty, subject to our terms and conditions. Coverage can vary with the type of repair and the parts used, so ask our team for details.', 5, true),
  ('What forms of payment do you accept?', 'We accept cash, debit cards and major credit cards. Payment options can change, so ask when you visit.', 6, true)
on conflict do nothing;

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
