'use client';

import { useRouter } from 'next/navigation';
import { useId } from 'react';
import { Controller } from 'react-hook-form';

import { saveBlogPostAction } from '@/actions/admin-content-actions';
import { FormActions } from '@/components/admin/form-actions';
import { ImageField } from '@/components/admin/image-field';
import { SwitchField } from '@/components/admin/switch-field';
import { FormField } from '@/components/forms/form-field';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ROUTES } from '@/constants/routes';
import { useActionForm } from '@/hooks/use-action-form';
import { blogPostSchema, type BlogPostInput } from '@/lib/validations/content';
import type { BlogPost } from '@/types/content';
import { slugify } from '@/utils/text';

interface BlogPostFormProps {
  post: BlogPost | null;
  savedCoverUrl: string | null;
}

export function BlogPostForm({ post, savedCoverUrl }: BlogPostFormProps) {
  const router = useRouter();
  const formId = useId();
  const fieldId = (name: string) => `${formId}-${name}`;

  const defaultValues: BlogPostInput = {
    title: post?.title ?? '',
    slug: post?.slug ?? '',
    excerpt: post?.excerpt ?? '',
    body: post?.body ?? '',
    coverImagePath: post?.cover_image_path ?? null,
    isPublished: post?.is_published ?? false,
  };

  const { form, submit, isPending, feedback } = useActionForm({
    schema: blogPostSchema,
    defaultValues,
    action: (input) => saveBlogPostAction(input, post?.id ?? null),
    onSuccess: (data) => {
      if (!post && data?.id) {
        router.replace(`${ROUTES.admin.blog}/${data.id}`);
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
    <form onSubmit={submit} noValidate className="grid gap-6 xl:grid-cols-3">
      <div className="grid gap-6 xl:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Article</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <FormField id={fieldId('title')} label="Title" required error={errors.title?.message}>
              {(aria) => (
                <Input
                  {...aria}
                  {...register('title', {
                    onBlur: () => {
                      if (!getValues('slug'))
                        setValue('slug', slugify(getValues('title')), { shouldValidate: true });
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
              id={fieldId('excerpt')}
              label="Excerpt"
              error={errors.excerpt?.message}
              hint="Shown on the blog listing."
            >
              {(aria) => <Textarea rows={2} {...aria} {...register('excerpt')} />}
            </FormField>

            <FormField
              id={fieldId('body')}
              label="Article body"
              error={errors.body?.message}
              hint="Markdown: use ## for section headings, blank lines between paragraphs, and - for bullet points. Images are not supported here."
            >
              {(aria) => (
                <Textarea
                  rows={20}
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
            <CardTitle className="text-base">Cover image</CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              control={control}
              name="coverImagePath"
              render={({ field }) => (
                <ImageField
                  id={fieldId('cover')}
                  folder="blog"
                  value={field.value ?? null}
                  savedPreviewUrl={savedCoverUrl}
                  onChange={field.onChange}
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Publishing</CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              control={control}
              name="isPublished"
              render={({ field }) => (
                <SwitchField
                  id={fieldId('isPublished')}
                  label="Published"
                  description="The first time you publish, the date is recorded and kept."
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
