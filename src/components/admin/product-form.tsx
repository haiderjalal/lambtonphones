'use client';

import { useRouter } from 'next/navigation';
import { useId } from 'react';
import { Controller } from 'react-hook-form';

import { saveProductAction } from '@/actions/admin-content-actions';
import { FormActions } from '@/components/admin/form-actions';
import { ImageField } from '@/components/admin/image-field';
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
import { ROUTES } from '@/constants/routes';
import { useActionForm } from '@/hooks/use-action-form';
import { productSchema, type ProductInput } from '@/lib/validations/content';
import type { Product, ProductCategory } from '@/types/content';
import { slugify } from '@/utils/text';

interface ProductFormProps {
  product: Product | null;
  categories: ProductCategory[];
  savedImageUrl: string | null;
}

export function ProductForm({ product, categories, savedImageUrl }: ProductFormProps) {
  const router = useRouter();
  const formId = useId();
  const fieldId = (name: string) => `${formId}-${name}`;

  const defaultValues: ProductInput = {
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    categoryId: product?.category_id ?? categories[0]?.id ?? '',
    summary: product?.summary ?? '',
    description: product?.description ?? '',
    priceAud: product?.price_aud == null ? '' : String(product.price_aud),
    imagePath: product?.image_path ?? null,
    isFeatured: product?.is_featured ?? false,
    isPublished: product?.is_published ?? true,
    sortOrder: String(product?.sort_order ?? 0),
  };

  const { form, submit, isPending, feedback } = useActionForm({
    schema: productSchema,
    defaultValues,
    action: (input) => saveProductAction(input, product?.id ?? null),
    onSuccess: (data) => {
      // A new product moves straight to its edit page, so a second save updates the same record.
      if (!product && data?.id) {
        router.replace(`${ROUTES.admin.products}/${data.id}`);
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

  const suggestSlugFromName = () => {
    if (getValues('slug')) return;
    setValue('slug', slugify(getValues('name')), { shouldValidate: true });
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="grid gap-6 xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Product details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <FormField id={fieldId('name')} label="Name" required error={errors.name?.message}>
                {(aria) => (
                  <Input {...aria} {...register('name', { onBlur: suggestSlugFromName })} />
                )}
              </FormField>

              <FormField
                id={fieldId('slug')}
                label="Web address (slug)"
                required
                error={errors.slug?.message}
                hint="Lowercase letters, numbers and hyphens."
              >
                {(aria) => <Input {...aria} {...register('slug')} />}
              </FormField>

              <FormField
                id={fieldId('category')}
                label="Category"
                required
                error={errors.categoryId?.message}
                className="sm:col-span-2"
              >
                {(aria) => (
                  <Controller
                    control={control}
                    name="categoryId"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          id={aria.id}
                          aria-invalid={aria['aria-invalid']}
                          aria-describedby={aria['aria-describedby']}
                          className="w-full"
                        >
                          <SelectValue placeholder="Choose a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                              {category.is_published ? '' : ' (hidden)'}
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
                label="Short summary"
                error={errors.summary?.message}
                className="sm:col-span-2"
                hint="Shown on cards in the shop. Keep it under 240 characters."
              >
                {(aria) => <Input {...aria} {...register('summary')} />}
              </FormField>

              <FormField
                id={fieldId('description')}
                label="Full description"
                error={errors.description?.message}
                className="sm:col-span-2"
              >
                {(aria) => <Textarea rows={6} {...aria} {...register('description')} />}
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                control={control}
                name="imagePath"
                render={({ field }) => (
                  <ImageField
                    id={fieldId('image')}
                    folder="products"
                    value={field.value ?? null}
                    savedPreviewUrl={savedImageUrl}
                    onChange={field.onChange}
                  />
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid content-start gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Price and visibility</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5">
              <FormField
                id={fieldId('price')}
                label="Price (AUD)"
                error={errors.priceAud?.message}
                hint="Leave blank to show Ask for price."
              >
                {(aria) => (
                  <Input
                    inputMode="decimal"
                    placeholder="49.95"
                    {...aria}
                    {...register('priceAud')}
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

              <Controller
                control={control}
                name="isPublished"
                render={({ field }) => (
                  <SwitchField
                    id={fieldId('isPublished')}
                    label="Published"
                    description="Visible on the shop when turned on."
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="isFeatured"
                render={({ field }) => (
                  <SwitchField
                    id={fieldId('isFeatured')}
                    label="Featured"
                    description="Shown on the homepage."
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </CardContent>
          </Card>

          <FormActions isPending={isPending} feedback={feedback} />
        </div>
      </div>
    </form>
  );
}
