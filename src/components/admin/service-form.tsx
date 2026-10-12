'use client';

import { useRouter } from 'next/navigation';
import { useId } from 'react';
import { Controller } from 'react-hook-form';

import { saveServiceAction } from '@/actions/admin-content-actions';
import { FormActions } from '@/components/admin/form-actions';
import { SwitchField } from '@/components/admin/switch-field';
import { FormField } from '@/components/forms/form-field';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SERVICE_ICON_KEYS, SERVICE_ICON_LABELS } from '@/constants/icons';
import { ROUTES } from '@/constants/routes';
import { useActionForm } from '@/hooks/use-action-form';
import { serviceSchema, type ServiceInput } from '@/lib/validations/content';
import type { Service } from '@/types/content';
import { joinLines, slugify } from '@/utils/text';

const TOP_LEVEL_OPTION = '__top-level__';

interface ServiceFormProps {
  service: Service | null;
  /** Top-level services that can act as a parent for this one. */
  parentOptions: Service[];
  hasDevicePages: boolean;
}

export function ServiceForm({ service, parentOptions, hasDevicePages }: ServiceFormProps) {
  const router = useRouter();
  const formId = useId();
  const fieldId = (name: string) => `${formId}-${name}`;

  const defaultValues: ServiceInput = {
    name: service?.name ?? '',
    slug: service?.slug ?? '',
    parentId: service?.parent_id ?? '',
    summary: service?.summary ?? '',
    description: service?.description ?? '',
    highlights: joinLines(service?.highlights ?? []),
    icon: service?.icon ?? 'wrench',
    sortOrder: String(service?.sort_order ?? 0),
    isPublished: service?.is_published ?? false,
  };

  const { form, submit, isPending, feedback } = useActionForm({
    schema: serviceSchema,
    defaultValues,
    action: (input) => saveServiceAction(input, service?.id ?? null),
    onSuccess: (data) => {
      if (!service && data?.id) {
        router.replace(`${ROUTES.admin.services}/${data.id}`);
      }
    },
  });

  const {
    formState: { errors },
    register,
    control,
    setValue,
    getValues,
  } = form;

  return (
    <form onSubmit={submit} noValidate className="grid gap-6">
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="text-base">Service details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <FormField id={fieldId('name')} label="Name" required error={errors.name?.message}>
            {(aria) => (
              <Input
                {...aria}
                {...register('name', {
                  onBlur: () => {
                    if (!getValues('slug'))
                      setValue('slug', slugify(getValues('name')), { shouldValidate: true });
                  },
                })}
              />
            )}
          </FormField>

          <FormField
            id={fieldId('slug')}
            label="Web address (slug)"
            required
            error={errors.slug?.message}
            hint="Used in the page address, for example /phone-repair."
          >
            {(aria) => <Input {...aria} {...register('slug')} />}
          </FormField>

          <FormField
            id={fieldId('parentId')}
            label="Parent service"
            error={errors.parentId?.message}
            hint={
              hasDevicePages
                ? 'This service has device pages, so it must stay top-level.'
                : 'Choose a parent to make this a device page, such as iPhone under Phone Repair.'
            }
            className="sm:col-span-2"
          >
            {(aria) => (
              <Controller
                control={control}
                name="parentId"
                render={({ field }) => (
                  <Select
                    value={field.value || TOP_LEVEL_OPTION}
                    onValueChange={(value) =>
                      field.onChange(value === TOP_LEVEL_OPTION ? '' : value)
                    }
                    disabled={hasDevicePages}
                  >
                    <SelectTrigger
                      id={aria.id}
                      aria-invalid={aria['aria-invalid']}
                      aria-describedby={aria['aria-describedby']}
                      className="w-full"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TOP_LEVEL_OPTION}>Top-level service</SelectItem>
                      {parentOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          Device page of {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
          </FormField>

          <FormField
            id={fieldId('summary')}
            label="Summary"
            error={errors.summary?.message}
            className="sm:col-span-2"
            hint="One or two sentences shown on cards."
          >
            {(aria) => <Input {...aria} {...register('summary')} />}
          </FormField>

          <FormField
            id={fieldId('description')}
            label="Description"
            error={errors.description?.message}
            className="sm:col-span-2"
          >
            {(aria) => <Textarea rows={5} {...aria} {...register('description')} />}
          </FormField>

          <FormField
            id={fieldId('highlights')}
            label="What is covered"
            error={errors.highlights?.message}
            className="sm:col-span-2"
            hint="One item per line. Up to 12 items."
          >
            {(aria) => <Textarea rows={6} {...aria} {...register('highlights')} />}
          </FormField>

          <FormField id={fieldId('icon')} label="Icon" required error={errors.icon?.message}>
            {(aria) => (
              <Controller
                control={control}
                name="icon"
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
                      {SERVICE_ICON_KEYS.map((key) => (
                        <SelectItem key={key} value={key}>
                          {SERVICE_ICON_LABELS[key]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
          </FormField>

          <FormField
            id={fieldId('sortOrder')}
            label="Display order"
            error={errors.sortOrder?.message}
            hint="Lower numbers appear first."
          >
            {(aria) => <Input inputMode="numeric" {...aria} {...register('sortOrder')} />}
          </FormField>

          <div className="sm:col-span-2">
            <Controller
              control={control}
              name="isPublished"
              render={({ field }) => (
                <SwitchField
                  id={fieldId('isPublished')}
                  label="Published"
                  description="Shows this service on the website and in the menu."
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </CardContent>
      </Card>

      <div className="max-w-3xl">
        <FormActions isPending={isPending} feedback={feedback} />
      </div>
    </form>
  );
}
