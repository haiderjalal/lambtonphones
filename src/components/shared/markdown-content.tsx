import ReactMarkdown from 'react-markdown';

import { cn } from '@/lib/utils';

interface MarkdownContentProps {
  source: string;
  className?: string;
}

/**
 * Renders admin-authored Markdown. Raw HTML is escaped by default, and images are removed so every
 * picture goes through next/image. Styling uses arbitrary variants because the project has no
 * typography plugin.
 */
export function MarkdownContent({ source, className }: MarkdownContentProps) {
  return (
    <div
      className={cn(
        'text-foreground/90 max-w-3xl text-base leading-relaxed',
        '[&_h2]:text-brand-ink [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight',
        '[&_h3]:text-brand-ink [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold',
        '[&_p]:mt-5 [&_p:first-child]:mt-0',
        '[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6',
        '[&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6',
        '[&_a]:text-primary [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4',
        '[&_strong]:text-brand-ink [&_strong]:font-semibold',
        '[&_blockquote]:border-primary [&_blockquote]:border-l-4 [&_blockquote]:pl-5 [&_blockquote]:italic',
        className,
      )}
    >
      <ReactMarkdown disallowedElements={['img']} unwrapDisallowed>
        {source}
      </ReactMarkdown>
    </div>
  );
}
