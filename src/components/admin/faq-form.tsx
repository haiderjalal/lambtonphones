'use client';

import { useRouter } from 'next/navigation';
import { useId } from 'react';
import { Controller } from 'react-hook-form';

import { saveFaqAction } from '@/actions/admin-content-actions';
import { FormActions } from '@/components/admin/form-actions';
import { SwitchField } from '@/components/admin/switch-field';
import { FormField } from '@/components/forms/form-field';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ROUTES } from '@/constants/routes';
import { useActionForm } from '@/hooks/use-action-form';
import { faqSchema, type FaqInput } from '@/lib/validations/content';
import type { Faq } from '@/types/content';

interface FaqFormProps {
  faq: Faq | null;
}

export function FaqForm({ faq }: FaqFormProps) {
  const router = useRouter();
  const formId = useId();
  const fieldId = (name: string) => `${formId}-${name}`;

  const defaultValues: FaqInput = {
    question: faq?.question ?? '',
    answer: faq?.answer ?? '',
    sortOrder: String(faq?.sort_order ?? 0),
    isPublished: faq?.is_published ?? true,
  };

  const { form, submit, isPending, feedback } = useActionForm({
    schema: faqSchema,
    defaultValues,
    action: (input) => saveFaqAction(input, faq?.id ?? null),
    onSuccess: (data) => {
      if (!faq && data?.id) {
        router.replace(`${ROUTES.admin.faqs}/${data.id}`);
      }
    },
  });

  const {
    formState: { errors },
    register,
    control,
  } = form;

  return (
    <form onSubmit={submit} noValidate>
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="text-base">Question and answer</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <FormField
            id={fieldId('question')}
            label="Question"
            required
            error={errors.question?.message}
          >
            {(aria) => <Input {...aria} {...register('question')} />}
          </FormField>

          <FormField id={fieldId('answer')} label="Answer" required error={errors.answer?.message}>
            {(aria) => <Textarea rows={5} {...aria} {...register('answer')} />}
          </FormField>

          <div className="grid gap-5 sm:grid-cols-2">
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
                  description="Shown on the homepage and support page."
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
