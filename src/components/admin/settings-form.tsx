'use client';

import { useId } from 'react';
import { Controller } from 'react-hook-form';

import { saveSiteSettingsAction } from '@/actions/admin-content-actions';
import { FormActions } from '@/components/admin/form-actions';
import { SwitchField } from '@/components/admin/switch-field';
import { FormField } from '@/components/forms/form-field';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AU_STATES } from '@/constants/business';
import { useActionForm } from '@/hooks/use-action-form';
import { siteSettingsSchema, type SiteSettingsInput } from '@/lib/validations/content';
import type { SiteSettings } from '@/types/content';
import { joinLines } from '@/utils/text';

interface SettingsFormProps {
  settings: SiteSettings;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const formId = useId();
  const fieldId = (name: string) => `${formId}-${name}`;

  const defaultValues: SiteSettingsInput = {
    businessName: settings.business_name,
    tagline: settings.tagline,
    phone: settings.phone,
    email: settings.email,
    streetAddress: settings.street_address,
    suburb: settings.suburb,
    state: settings.state,
    postcode: settings.postcode,
    mapsUrl: settings.maps_url ?? '',
    facebookUrl: settings.facebook_url ?? '',
    instagramUrl: settings.instagram_url ?? '',
    heroHeading: settings.hero_heading,
    heroSubheading: settings.hero_subheading,
    announcementText: settings.announcement_text ?? '',
    announcementActive: settings.announcement_active,
    openingHours: joinLines(settings.opening_hours),
    trustHighlights: joinLines(settings.trust_highlights),
  };

  const { form, submit, isPending, feedback } = useActionForm({
    schema: siteSettingsSchema,
    defaultValues,
    action: saveSiteSettingsAction,
  });

  const {
    formState: { errors },
    register,
    control,
  } = form;

  return (
    <form onSubmit={submit} noValidate className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Business</CardTitle>
          <CardDescription>
            Shown in the header, footer, contact page and search results.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <FormField
            id={fieldId('businessName')}
            label="Business name"
            required
            error={errors.businessName?.message}
          >
            {(aria) => <Input {...aria} {...register('businessName')} />}
          </FormField>
          <FormField id={fieldId('tagline')} label="Tagline" error={errors.tagline?.message}>
            {(aria) => <Input {...aria} {...register('tagline')} />}
          </FormField>
          <FormField id={fieldId('phone')} label="Phone" required error={errors.phone?.message}>
            {(aria) => <Input type="tel" {...aria} {...register('phone')} />}
          </FormField>
          <FormField id={fieldId('email')} label="Email" required error={errors.email?.message}>
            {(aria) => <Input type="email" {...aria} {...register('email')} />}
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Address and links</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <FormField
            id={fieldId('streetAddress')}
            label="Street address"
            required
            error={errors.streetAddress?.message}
            className="sm:col-span-2"
          >
            {(aria) => <Input {...aria} {...register('streetAddress')} />}
          </FormField>
          <FormField id={fieldId('suburb')} label="Suburb" required error={errors.suburb?.message}>
            {(aria) => <Input {...aria} {...register('suburb')} />}
          </FormField>
          <FormField id={fieldId('state')} label="State" required error={errors.state?.message}>
            {(aria) => (
              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id={aria.id}
                      aria-invalid={aria['aria-invalid']}
                      aria-describedby={aria['aria-describedby']}
                      className="w-full"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AU_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
          </FormField>
          <FormField
            id={fieldId('postcode')}
            label="Postcode"
            required
            error={errors.postcode?.message}
          >
            {(aria) => (
              <Input inputMode="numeric" maxLength={4} {...aria} {...register('postcode')} />
            )}
          </FormField>
          <FormField
            id={fieldId('mapsUrl')}
            label="Maps link"
            error={errors.mapsUrl?.message}
            hint="Optional. Leave blank to use an address search."
          >
            {(aria) => <Input type="url" {...aria} {...register('mapsUrl')} />}
          </FormField>
          <FormField
            id={fieldId('facebookUrl')}
            label="Facebook link"
            error={errors.facebookUrl?.message}
          >
            {(aria) => <Input type="url" {...aria} {...register('facebookUrl')} />}
          </FormField>
          <FormField
            id={fieldId('instagramUrl')}
            label="Instagram link"
            error={errors.instagramUrl?.message}
          >
            {(aria) => <Input type="url" {...aria} {...register('instagramUrl')} />}
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Homepage</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <FormField
            id={fieldId('heroHeading')}
            label="Heading"
            required
            error={errors.heroHeading?.message}
          >
            {(aria) => <Input {...aria} {...register('heroHeading')} />}
          </FormField>
          <FormField
            id={fieldId('heroSubheading')}
            label="Introduction"
            required
            error={errors.heroSubheading?.message}
          >
            {(aria) => <Textarea rows={3} {...aria} {...register('heroSubheading')} />}
          </FormField>
          <FormField
            id={fieldId('trustHighlights')}
            label="Promise ribbon"
            error={errors.trustHighlights?.message}
            hint="One promise per line, up to 12. Shown in the scrolling ribbon."
          >
            {(aria) => <Textarea rows={5} {...aria} {...register('trustHighlights')} />}
          </FormField>
          <FormField
            id={fieldId('announcementText')}
            label="Announcement"
            error={errors.announcementText?.message}
            hint="Shown in a bar above the header when turned on."
          >
            {(aria) => <Input {...aria} {...register('announcementText')} />}
          </FormField>
          <Controller
            control={control}
            name="announcementActive"
            render={({ field }) => (
              <SwitchField
                id={fieldId('announcementActive')}
                label="Show announcement"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Opening hours</CardTitle>
          <CardDescription>
            One line per entry, shown in the footer and on the contact page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            id={fieldId('openingHours')}
            label="Hours"
            required
            error={errors.openingHours?.message}
          >
            {(aria) => <Textarea rows={4} {...aria} {...register('openingHours')} />}
          </FormField>
        </CardContent>
      </Card>

      <FormActions isPending={isPending} feedback={feedback} submitLabel="Save business details" />
    </form>
  );
}
