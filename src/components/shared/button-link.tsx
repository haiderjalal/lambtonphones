import Link from 'next/link';
import type { ComponentProps } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ButtonVariants = NonNullable<Parameters<typeof buttonVariants>[0]>;

interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, 'className'> {
  variant?: ButtonVariants['variant'];
  size?: ButtonVariants['size'];
  className?: string;
}

/** Next.js link styled as a button. Use for navigation so the browser gets a real URL. */
export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
