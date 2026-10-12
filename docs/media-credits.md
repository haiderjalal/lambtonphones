# Photos and media credits

Every photo on the site comes from [Unsplash](https://unsplash.com/license), which is free for
commercial and non-commercial use. Attribution is not required, but the source is recorded here so
each image can be traced or replaced.

These are stock photos. They illustrate the services and are not photos of this shop. The home page
labels them "Stock photos shown for illustration." Replace them with the business's own photos before
launch (see [decisions.md](decisions.md)).

## Static photos (`public/images`)

Served with `next/image`, which converts them to AVIF or WebP on request. Each file is already WebP
and sized for its slot. Paths are defined in `src/constants/site-images.ts`.

| File                             | Used on                       | Unsplash image ID                  | Search used                   |
| -------------------------------- | ----------------------------- | ---------------------------------- | ----------------------------- |
| `hero/repair-bench.webp`         | Home hero photo               | `photo-1639776738932-956082f0b704` | phone repair technician       |
| `hero/parts-on-mat.webp`         | Home hero inset photo         | `photo-1746005514011-ea00280f3b6e` | phone repair technician       |
| `home/quote-desk.webp`           | Home quote section            | `photo-1559037068-e98af2a7c244`    | smartphone on desk minimal    |
| `services/phone-repair.webp`     | Phone repair card             | `photo-1539331586018-346b53b2aaa4` | phone repair technician       |
| `services/iphone-repair.webp`    | iPhone repair page card       | `photo-1639776739297-f7e1f21526f4` | iphone screen repair          |
| `services/samsung-repair.webp`   | Samsung repair page card      | `photo-1707438095940-1eee18e85400` | samsung galaxy phone          |
| `services/google-repair.webp`    | Google Pixel repair page card | `photo-1598965402089-897ce52e8355` | google pixel phone            |
| `services/other-repair.webp`     | Other phone brands page card  | `photo-1550041473-d296a3a8a18a`    | android smartphone repair     |
| `services/laptop-repair.webp`    | Laptop repair card            | `photo-1721333089073-215a56fd710c` | laptop repair                 |
| `services/tablet-repair.webp`    | Tablet repair card            | `photo-1709102884400-b50ca1a12bc3` | laptop repair                 |
| `services/console-repair.webp`   | Console repair card           | `photo-1612287230202-1ff1d85d1bdf` | game console controller       |
| `services/data-recovery.webp`    | Data recovery card            | `photo-1703319952940-ec62d23def39` | hard drive data recovery      |
| `workshop/soldering.webp`        | Home "How we repair" gallery  | `photo-1521798604188-0d6595d6d6ae` | soldering iron circuit        |
| `workshop/motherboard.webp`      | Home "How we repair" gallery  | `photo-1620283085439-39620a1e21c4` | laptop repair                 |
| `workshop/cooling-board.webp`    | Home "How we repair" gallery  | `photo-1769085795297-b45cc8c92f5b` | laptop repair                 |
| `workshop/technician-tools.webp` | Home "How we repair" gallery  | `photo-1775519686045-cfd36ca0accc` | electronics repair workbench  |
| `backgrounds/repair-tools.webp`  | Call-to-action band           | `photo-1588515603068-adb330f26e92` | phone repair technician       |
| `pages/about-banner.webp`        | About page header             | `photo-1746005718004-1f992c399428` | phone repair technician       |
| `pages/shop-banner.webp`         | Accessories page header       | `photo-1695480571861-90044e831733` | phone screen protector        |
| `pages/services-banner.webp`     | Services page header          | `photo-1671040690726-b78261eff126` | repair workbench tools        |
| `pages/contact-banner.webp`      | Contact page header           | `photo-1656127321685-52e7aed9c711` | phone call hands              |
| `pages/support-banner.webp`      | Support page header           | `photo-1788025487883-c59e1f8edcaa` | laptop help desk              |
| `pages/blog-banner.webp`         | Blog page header              | `photo-1612367980327-7454a7276aa7` | notebook writing desk minimal |

The image ID is the part of the file address on `images.unsplash.com` (for example,
`https://images.unsplash.com/photo-1639776738932-956082f0b704`). Search Unsplash for the ID to open
the photo's page.

## Accessory photos (Supabase Storage)

Product photos live in the `site-media` bucket under `products/<slug>.webp`. Each product's
`image_path` column points to its file. Products without an uploaded photo show a category icon.

| Storage path                                    | Product                         | Unsplash image ID                  | Search used                           |
| ----------------------------------------------- | ------------------------------- | ---------------------------------- | ------------------------------------- |
| `products/clear-case.webp`                      | Clear Case                      | `photo-1535157412991-2ef801c1748b` | phone case                            |
| `products/wireless-earphones.webp`              | Wireless Earphones              | `photo-1578319439584-104c94d37305` | wireless earbuds                      |
| `products/fast-wall-adapter.webp`               | Fast Wall Adapter               | `photo-1583863788434-e58a36330cf0` | phone charger adapter                 |
| `products/tempered-glass-screen-protector.webp` | Tempered Glass Screen Protector | `photo-1537145605632-2fa0f95316b0` | tempered glass phone screen protector |
| `products/charging-cable.webp`                  | Charging Cable                  | `photo-1572721546624-05bf65ad7679` | usb cable charging                    |
| `products/wireless-charger.webp`                | Wireless Charger                | `photo-1591290619618-904f6dd935e3` | wireless charger pad                  |
| `products/bluetooth-speaker.webp`               | Bluetooth Speaker               | `photo-1547052178-7f2c5a20c332`    | bluetooth speaker                     |
| `products/car-phone-holder.webp`                | Car Phone Holder                | `photo-1717007873182-7cc5d673cbff` | phone holder car mount                |

The Tempered Glass photo shows a clear glass protector on a phone. The Car Phone Holder photo is
portrait, so the card crops it to fit.

Products without a Supabase photo, such as the Anti-Glare Screen Protector, still show their icon.

## Blog covers (Supabase Storage)

Each article's cover image lives in the `site-media` bucket under `blog/<slug>.webp`, and the
article's `cover_image_path` column points to it.

| Storage path                                      | Article                                                        | Unsplash image ID                  | Search used            |
| ------------------------------------------------- | -------------------------------------------------------------- | ---------------------------------- | ---------------------- |
| `blog/battery-signs-phone-needs-replacing.webp`   | How to tell your phone battery needs replacing                 | `photo-1536692192939-f1547f1cde39` | phone battery          |
| `blog/slow-phone-charging-checks.webp`            | Why your phone charges slowly, and what to check first         | `photo-1557767382-97b28f5488e7`    | phone charger cable    |
| `blog/water-damage-first-hour.webp`               | What to do if your phone gets wet                              | `photo-1765220066469-54d4efe41ca5` | smartphone in water    |
| `blog/back-up-before-phone-repair.webp`           | Back up your phone before any repair                           | `photo-1523398845774-0d176ba6fd41` | laptop backup          |
| `blog/screen-protectors-and-cases-explained.webp` | Screen protectors and cases: what actually protects your phone | `photo-1583291023438-41cef6453b1f` | phone screen protector |

The article text was written for the site as general repair advice, and it has not been checked by
the business. Review it before launch, and remove any article the business does not want to publish.

## Adding a photo

1. Choose a free-to-use photo (Unsplash, Pexels or similar) and record its source ID in the table above.
2. Convert it to WebP at the width the slot needs, about 1000 to 1920 px, and save it under
   `public/images/<area>/`.
3. Add a `SiteImage` entry in `src/constants/site-images.ts`, with an empty `alt` for decorative photos.
4. Run `npm test`. The test in `src/constants/site-images.test.ts` fails if a referenced file is missing.
