import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { TiltCard } from '@/components/shared/tilt-card';
import { blogPostHref } from '@/constants/routes';
import { getMediaUrl } from '@/lib/supabase/media';
import type { BlogPost } from '@/types/content';
import { formatDate } from '@/utils/format';

interface PostCardProps {
  post: BlogPost;
}

/** Article tile. The card tilts toward the pointer, and its cover zooms slowly on hover. */
export function PostCard({ post }: PostCardProps) {
  const coverUrl = getMediaUrl(post.cover_image_path);
  const publishedLabel = post.published_at ? formatDate(post.published_at) : null;

  return (
    <TiltCard>
      <Link
        href={blogPostHref(post.slug)}
        className="group border-border bg-card hover:border-brand-ink/30 flex h-full flex-col overflow-hidden rounded-lg border transition-colors duration-500"
      >
        <div className="bg-secondary relative aspect-[16/10] overflow-hidden">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
          ) : null}
        </div>
        <div className="flex flex-1 flex-col p-6">
          {publishedLabel ? (
            <time
              dateTime={post.published_at ?? undefined}
              className="text-muted-foreground text-xs font-medium tracking-[0.14em] uppercase"
            >
              {publishedLabel}
            </time>
          ) : null}
          <h3 className="text-brand-ink font-display mt-3 text-2xl leading-tight font-normal">
            {post.title}
          </h3>
          {post.excerpt ? (
            <p className="text-muted-foreground mt-3 flex-1 text-sm leading-relaxed">
              {post.excerpt}
            </p>
          ) : null}
          <span className="text-brand-ink mt-6 inline-flex items-center gap-2 text-sm font-medium">
            <span className="link-draw">Read article</span>
            <ArrowRight
              className="size-4 transition-transform duration-500 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    </TiltCard>
  );
}
