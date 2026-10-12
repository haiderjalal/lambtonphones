import { Clock, Mail, MapPin, Phone } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonLink } from '@/components/shared/button-link';
import type { SiteSettings } from '@/types/content';
import { toTelHref } from '@/utils/format';

interface ContactPanelProps {
  settings: SiteSettings;
}

/** Address, phone, email and opening hours. Every value comes from the CMS settings. */
export function ContactPanel({ settings }: ContactPanelProps) {
  const address = `${settings.street_address}, ${settings.suburb} ${settings.state} ${settings.postcode}`;
  const mapsUrl =
    settings.maps_url ??
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <div className="grid gap-5">
      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-brand-ink flex items-center gap-3 text-lg">
            <span className="bg-accent text-accent-foreground flex size-10 items-center justify-center rounded-xl">
              <Phone className="size-5" aria-hidden="true" />
            </span>
            Call the shop
          </CardTitle>
        </CardHeader>
        <CardContent>
          <a
            href={toTelHref(settings.phone)}
            className="text-primary text-2xl font-bold hover:underline"
          >
            {settings.phone}
          </a>
          <p className="text-muted-foreground mt-2 text-sm">
            Quote your reference when you call about an existing enquiry.
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-brand-ink flex items-center gap-3 text-lg">
            <span className="bg-accent text-accent-foreground flex size-10 items-center justify-center rounded-xl">
              <Mail className="size-5" aria-hidden="true" />
            </span>
            Email us
          </CardTitle>
        </CardHeader>
        <CardContent>
          <a
            href={`mailto:${settings.email}`}
            className="text-primary font-semibold break-all hover:underline"
          >
            {settings.email}
          </a>
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-brand-ink flex items-center gap-3 text-lg">
            <span className="bg-accent text-accent-foreground flex size-10 items-center justify-center rounded-xl">
              <MapPin className="size-5" aria-hidden="true" />
            </span>
            Visit the shop
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-foreground/90 text-sm leading-relaxed">{address}</p>
          <ButtonLink
            href={mapsUrl}
            variant="outline"
            className="w-fit"
            target="_blank"
            rel="noreferrer"
          >
            Open in Maps
          </ButtonLink>
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-brand-ink flex items-center gap-3 text-lg">
            <span className="bg-accent text-accent-foreground flex size-10 items-center justify-center rounded-xl">
              <Clock className="size-5" aria-hidden="true" />
            </span>
            Opening hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-foreground/90 grid gap-2 text-sm">
            {settings.opening_hours.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="text-muted-foreground mt-4 text-sm">
            Walk-ins are welcome. Appointments are optional.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
