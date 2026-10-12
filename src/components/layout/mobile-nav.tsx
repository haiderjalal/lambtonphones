'use client';

import Link from 'next/link';
import { Menu, Phone } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { PRIMARY_NAV_LINKS, type NavigationLink } from '@/constants/navigation';
import { ROUTES } from '@/constants/routes';
import { toTelHref } from '@/utils/format';

interface MobileNavProps {
  services: NavigationLink[];
  phone: string;
}

/** Off-canvas menu for small screens. Closes itself after navigation so the next page is visible. */
export function MobileNav({ services, phone }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu className="size-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[88vw] max-w-sm overflow-y-auto p-0">
        <SheetHeader className="border-border border-b p-5 text-left">
          <SheetTitle className="text-brand-ink text-lg">Menu</SheetTitle>
          <SheetDescription>Repairs, accessories and contact details.</SheetDescription>
        </SheetHeader>

        <nav aria-label="Mobile" className="flex flex-col gap-1 p-4">
          <p className="text-muted-foreground px-3 pt-2 pb-1 text-xs font-semibold tracking-[0.16em] uppercase">
            Repair services
          </p>
          {services.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              onClick={closeMenu}
              className="text-brand-ink hover:bg-secondary rounded-xl px-3 py-3 text-base font-medium"
            >
              {service.label}
            </Link>
          ))}

          <p className="text-muted-foreground px-3 pt-5 pb-1 text-xs font-semibold tracking-[0.16em] uppercase">
            Explore
          </p>
          {PRIMARY_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="text-brand-ink hover:bg-secondary rounded-xl px-3 py-3 text-base font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="border-border mt-auto grid gap-3 border-t p-5">
          <Button asChild size="lg">
            <Link href={ROUTES.contact} onClick={closeMenu}>
              Get a free quote
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href={toTelHref(phone)}>
              <Phone className="size-4" aria-hidden="true" />
              Call {phone}
            </a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
