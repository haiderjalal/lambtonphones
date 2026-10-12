'use client';

import {
  BookOpen,
  ExternalLink,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  Settings,
  Tags,
  Wrench,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { signOutAction } from '@/actions/auth-actions';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

const ADMIN_LINKS = [
  { label: 'Dashboard', href: ROUTES.admin.root, icon: LayoutDashboard },
  { label: 'Enquiries', href: ROUTES.admin.enquiries, icon: Inbox },
  { label: 'Products', href: ROUTES.admin.products, icon: Package },
  { label: 'Categories', href: ROUTES.admin.categories, icon: Tags },
  { label: 'Repair services', href: ROUTES.admin.services, icon: Wrench },
  { label: 'Blog', href: ROUTES.admin.blog, icon: BookOpen },
  { label: 'FAQs', href: ROUTES.admin.faqs, icon: MessageSquare },
  { label: 'Pages', href: ROUTES.admin.pages, icon: FileText },
  { label: 'Business details', href: ROUTES.admin.settings, icon: Settings },
] as const;

/** Sidebar navigation for the admin area. Highlights the current section. */
export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="flex flex-col gap-1">
      {ADMIN_LINKS.map(({ label, href, icon: Icon }) => {
        const isActive = href === ROUTES.admin.root ? pathname === href : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-white/10 text-white'
                : 'text-slate-300 hover:bg-white/5 hover:text-white',
            )}
          >
            <Icon className={cn('size-4.5', isActive && 'text-brand-glow')} aria-hidden="true" />
            {label}
          </Link>
        );
      })}

      <div className="mt-6 grid gap-1 border-t border-white/10 pt-4">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="size-4.5" aria-hidden="true" />
          View live site
        </Link>
        <form action={signOutAction}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start gap-3 px-3 text-slate-300 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="size-4.5" aria-hidden="true" />
            Sign out
          </Button>
        </form>
      </div>
    </nav>
  );
}
