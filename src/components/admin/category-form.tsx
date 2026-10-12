'use client';

import { useRouter } from 'next/navigation';
import { useId } from 'react';
import { Controller } from 'react-hook-form';

import { saveCategoryAction } from '@/actions/admin-content-actions';
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
import { categorySchema, type CategoryInput } from '@/lib/validations/content';
import type { ProductCategory } from '@/types/content';
import { slugify } from '@/utils/text';

interface CategoryFormProps {
  category: ProductCategory | null;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const formId = useId();
  const fieldId = (name: string) => `${formId}-${name}`;

  const defaultValues: CategoryInput = {
    name: category?.name ?? '',
    slug: category?.slug ?? '',
    description: category?.description ?? '',
    icon: category?.icon ?? 'package',
    sortOrder: String(category?.sort_order ?? 0),
    isPublished: category?.is_published ?? true,
  };

  const { form, submit, isPending, feedback } = useActionForm({
    schema: categorySchema,
    defaultValues,
    action: (input) => saveCategoryAction(input, category?.id ?? null),
    onSuccess: (data) => {
      if (!category && data?.id) {
        router.replace(`${ROUTES.admin.categories}/${data.id}`);
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
    <form onSubmit={submit} noValidate>
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="text-base">Category details</CardTitle>
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
          >
            {(aria) => <Input {...aria} {...register('slug')} />}
          </FormField>

          <FormField
            id={fieldId('description')}
            label="Description"
            error={errors.description?.message}
            className="sm:col-span-2"
          >
            {(aria) => <Textarea rows={3} {...aria} {...register('description')} />}
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
                  description="Shows this category in the shop filters."
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
