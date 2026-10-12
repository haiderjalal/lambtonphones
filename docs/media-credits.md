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

| File                             | Used on                      | Unsplash image ID                  | Search used                  |
| -------------------------------- | ---------------------------- | ---------------------------------- | ---------------------------- |
| `hero/repair-bench.webp`         | Home hero background         | `photo-1639776738932-956082f0b704` | phone repair technician      |
| `hero/parts-on-mat.webp`         | Home hero phone screen       | `photo-1746005514011-ea00280f3b6e` | phone repair technician      |
| `services/phone-repair.webp`     | Phone repair card            | `photo-1539331586018-346b53b2aaa4` | phone repair technician      |
| `services/laptop-repair.webp`    | Laptop repair card           | `photo-1721333089073-215a56fd710c` | laptop repair                |
| `services/tablet-repair.webp`    | Tablet repair card           | `photo-1709102884400-b50ca1a12bc3` | laptop repair                |
| `services/console-repair.webp`   | Console repair card          | `photo-1612287230202-1ff1d85d1bdf` | game console controller      |
| `services/data-recovery.webp`    | Data recovery card           | `photo-1703319952940-ec62d23def39` | hard drive data recovery     |
| `workshop/soldering.webp`        | Home "How we repair" gallery | `photo-1521798604188-0d6595d6d6ae` | soldering iron circuit       |
| `workshop/motherboard.webp`      | Home "How we repair" gallery | `photo-1620283085439-39620a1e21c4` | laptop repair                |
| `workshop/cooling-board.webp`    | Home "How we repair" gallery | `photo-1769085795297-b45cc8c92f5b` | laptop repair                |
| `workshop/technician-tools.webp` | Home "How we repair" gallery | `photo-1775519686045-cfd36ca0accc` | electronics repair workbench |
| `backgrounds/repair-tools.webp`  | Call-to-action band          | `photo-1588515603068-adb330f26e92` | phone repair technician      |
| `pages/about-banner.webp`        | About page header            | `photo-1746005718004-1f992c399428` | phone repair technician      |
| `pages/shop-banner.webp`         | Accessories page header      | `photo-1695480571861-90044e831733` | phone screen protector       |

The image ID is the part of the file address on `images.unsplash.com` (for example,
`https://images.unsplash.com/photo-1639776738932-956082f0b704`). Search Unsplash for the ID to open
the photo's page.

## Accessory photos (Supabase Storage)

Product photos live in the `site-media` bucket under `products/<slug>.webp`. Each product's
`image_path` column points to its file. Products without an uploaded photo show a category icon.

| Storage path                       | Product            | Unsplash image ID                  | Search used           |
| ---------------------------------- | ------------------ | ---------------------------------- | --------------------- |
| `products/clear-case.webp`         | Clear Case         | `photo-1535157412991-2ef801c1748b` | phone case            |
| `products/wireless-earphones.webp` | Wireless Earphones | `photo-1578319439584-104c94d37305` | wireless earbuds      |
| `products/fast-wall-adapter.webp`  | Fast Wall Adapter  | `photo-1583863788434-e58a36330cf0` | phone charger adapter |

Tempered Glass Screen Protector has no photo yet. It shows its icon until one is uploaded through the
admin area (Products, then Edit, then Image).

## Adding a photo

1. Choose a free-to-use photo (Unsplash, Pexels or similar) and record its source ID in the table above.
2. Convert it to WebP at the width the slot needs, about 1000 to 1920 px, and save it under
   `public/images/<area>/`.
3. Add a `SiteImage` entry in `src/constants/site-images.ts`, with an empty `alt` for decorative photos.
4. Run `npm test`. The test in `src/constants/site-images.test.ts` fails if a referenced file is missing.
