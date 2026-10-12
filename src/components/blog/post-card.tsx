import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { blogPostHref } from '@/constants/routes';
import { getMediaUrl } from '@/lib/supabase/media';
import type { BlogPost } from '@/types/content';
import { formatDate } from '@/utils/format';

interface PostCardProps {
  post: BlogPost;
}

export function PostCard({ post }: PostCardProps) {
  const coverUrl = getMediaUrl(post.cover_image_path);
  const publishedLabel = post.published_at ? formatDate(post.published_at) : null;

  return (
    <Link
      href={blogPostHref(post.slug)}
      className="group border-border bg-card flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5"
    >
      <div className="from-brand-ink to-primary/70 relative aspect-[16/9] overflow-hidden bg-gradient-to-br">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {publishedLabel ? (
          <time
            dateTime={post.published_at ?? undefined}
            className="text-primary text-xs font-semibold tracking-wider uppercase"
          >
            {publishedLabel}
          </time>
        ) : null}
        <h3 className="text-brand-ink mt-2 text-lg font-semibold">{post.title}</h3>
        {post.excerpt ? (
          <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">
            {post.excerpt}
          </p>
        ) : null}
        <span className="text-primary mt-5 inline-flex items-center gap-1.5 text-sm font-semibold">
          Read article
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
