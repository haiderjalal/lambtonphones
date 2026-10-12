'use client';

import { useId } from 'react';
import { Controller } from 'react-hook-form';

import { saveContentPageAction } from '@/actions/admin-content-actions';
import { FormActions } from '@/components/admin/form-actions';
import { SwitchField } from '@/components/admin/switch-field';
import { FormField } from '@/components/forms/form-field';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useActionForm } from '@/hooks/use-action-form';
import { contentPageSchema, type ContentPageInput } from '@/lib/validations/content';
import type { ContentPage } from '@/types/content';

interface PageFormProps {
  page: ContentPage;
}

export function PageForm({ page }: PageFormProps) {
  const formId = useId();
  const fieldId = (name: string) => `${formId}-${name}`;

  const defaultValues: ContentPageInput = {
    title: page.title,
    slug: page.slug,
    metaDescription: page.meta_description,
    body: page.body,
    isPublished: page.is_published,
  };

  const { form, submit, isPending, feedback } = useActionForm({
    schema: contentPageSchema,
    defaultValues,
    action: (input) => saveContentPageAction(input, page.id),
  });

  const {
    formState: { errors },
    register,
    control,
  } = form;

  return (
    <form onSubmit={submit} noValidate className="grid gap-6 xl:grid-cols-3">
      <div className="grid gap-6 xl:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Page content</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <FormField id={fieldId('title')} label="Title" required error={errors.title?.message}>
              {(aria) => <Input {...aria} {...register('title')} />}
            </FormField>

            <FormField
              id={fieldId('body')}
              label="Body"
              required
              error={errors.body?.message}
              hint="Markdown. Use ## for section headings and blank lines between paragraphs."
            >
              {(aria) => (
                <Textarea
                  rows={22}
                  className="font-mono text-sm leading-relaxed"
                  {...aria}
                  {...register('body')}
                />
              )}
            </FormField>
          </CardContent>
        </Card>
      </div>

      <div className="grid content-start gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Search listing</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <FormField
              id={fieldId('slug')}
              label="Web address (slug)"
              required
              error={errors.slug?.message}
            >
              {(aria) => <Input {...aria} {...register('slug')} />}
            </FormField>

            <FormField
              id={fieldId('metaDescription')}
              label="Meta description"
              error={errors.metaDescription?.message}
              hint="Shown in search results. Up to 160 characters."
            >
              {(aria) => <Textarea rows={3} {...aria} {...register('metaDescription')} />}
            </FormField>

            <Controller
              control={control}
              name="isPublished"
              render={({ field }) => (
                <SwitchField
                  id={fieldId('isPublished')}
                  label="Published"
                  description="Turn off to hide this page while it is being reviewed."
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </CardContent>
        </Card>

        <FormActions isPending={isPending} feedback={feedback} />
      </div>
    </form>
  );
}
