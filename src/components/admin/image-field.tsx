'use client';

import Image from 'next/image';
import { ImageUp, Loader2, X } from 'lucide-react';
import { useState, useTransition, type ChangeEvent } from 'react';

import { uploadImageAction } from '@/actions/media-actions';
import { Button } from '@/components/ui/button';
import { MEDIA_MIME_TYPES, type MediaMimeType } from '@/constants/media';

interface ImageFieldProps {
  id: string;
  folder: 'products' | 'blog';
  value: string | null;
  /** Public URL for the stored image, provided by the server for existing records. */
  savedPreviewUrl: string | null;
  onChange: (path: string | null) => void;
  describedBy?: string;
}

const ACCEPTED_TYPES: readonly MediaMimeType[] = MEDIA_MIME_TYPES;

/**
 * Uploads a photo through a server action (which checks the file's real type and size), then
 * stores the returned path in the form. Re-selecting a file or removing it is always possible.
 */
export function ImageField({
  id,
  folder,
  value,
  savedPreviewUrl,
  onChange,
  describedBy,
}: ImageFieldProps) {
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, startUpload] = useTransition();

  const previewUrl = value ? (uploadedPreviewUrl ?? savedPreviewUrl) : null;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    setError(null);
    const formData = new FormData();
    formData.set('folder', folder);
    formData.set('file', file);

    startUpload(async () => {
      const result = await uploadImageAction(formData);

      if (!result.ok || !result.data) {
        setError(result.ok ? 'The image could not be uploaded.' : result.message);
        return;
      }

      onChange(result.data.path);
      setUploadedPreviewUrl(result.data.url);
    });
  }

  function handleRemove() {
    setUploadedPreviewUrl(null);
    setError(null);
    onChange(null);
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="border-border bg-secondary/60 relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl border border-dashed sm:w-48">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Current image preview"
              fill
              sizes="192px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <ImageUp className="text-muted-foreground size-8" aria-hidden="true" />
          )}
        </div>

        <div className="grid gap-2">
          <label
            htmlFor={id}
            className="border-border bg-card text-brand-ink hover:border-primary/50 focus-within:ring-ring inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors focus-within:ring-2"
          >
            {isUploading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <ImageUp className="size-4" aria-hidden="true" />
            )}
            {isUploading ? 'Uploading...' : previewUrl ? 'Replace image' : 'Upload image'}
          </label>
          <input
            id={id}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            className="sr-only"
            disabled={isUploading}
            aria-describedby={describedBy}
            onChange={handleFileChange}
          />
          <p className="text-muted-foreground text-xs">JPG, PNG, WebP or AVIF, up to 5 MB.</p>
          {previewUrl ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-fit"
              onClick={handleRemove}
            >
              <X className="size-4" aria-hidden="true" />
              Remove image
            </Button>
          ) : null}
          {error ? (
            <p role="alert" className="text-destructive text-sm font-medium">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
