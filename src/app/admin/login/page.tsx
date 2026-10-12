import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { LoginForm } from '@/components/admin/login-form';
import { Logo } from '@/components/layout/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { getAdminContext } from '@/services/admin-auth-service';

export const metadata: Metadata = {
  title: 'Admin sign in',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  // Anyone already signed in as an administrator goes straight to the dashboard.
  const admin = await getAdminContext();

  if (admin) {
    redirect(ROUTES.admin.root);
  }

  return (
    <main className="bg-secondary/40 flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <Card className="shadow-xl shadow-slate-900/5">
          <CardHeader>
            <CardTitle className="text-xl">Sign in to manage the website</CardTitle>
            <CardDescription>For authorised staff only.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
