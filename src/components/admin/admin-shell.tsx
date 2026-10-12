import type { ReactNode } from 'react';

import { AdminNav } from '@/components/admin/admin-nav';
import { Logo } from '@/components/layout/logo';

interface AdminShellProps {
  email: string;
  children: ReactNode;
}

/** Two-column admin layout. The sidebar stacks above the content on small screens. */
export function AdminShell({ email, children }: AdminShellProps) {
  return (
    <div className="bg-secondary/40 min-h-dvh lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="bg-brand-ink px-4 py-6 text-slate-200 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:overflow-y-auto">
        <div className="flex items-center justify-between gap-3 px-2">
          <Logo className="[&_.text-brand-ink]:text-white [&_.text-muted-foreground]:text-slate-400" />
        </div>
        <p className="mt-6 px-2 text-xs text-slate-400">
          Signed in as <span className="font-medium break-all text-slate-200">{email}</span>
        </p>
        <div className="mt-6 lg:flex-1">
          <AdminNav />
        </div>
      </aside>

      <main id="admin-main" className="min-w-0 px-4 py-8 sm:px-8 lg:px-10">
        {children}
      </main>
    </div>
  );
}
