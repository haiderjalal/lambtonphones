import { ROUTES } from '@/constants/routes';

export interface NavigationLink {
  label: string;
  href: string;
}

/** Primary links. Repair services are added from the database so the menu stays in sync. */
export const PRIMARY_NAV_LINKS: readonly NavigationLink[] = [
  { label: 'Shop', href: ROUTES.shop },
  { label: 'About', href: ROUTES.about },
  { label: 'Blog', href: ROUTES.blog },
  { label: 'Support', href: ROUTES.support },
  { label: 'Contact', href: ROUTES.contact },
];

export const FOOTER_LEGAL_LINKS: readonly NavigationLink[] = [
  { label: 'Support', href: ROUTES.support },
  { label: 'Terms and Conditions', href: ROUTES.terms },
  { label: 'Privacy Policy', href: ROUTES.privacy },
];
