import type { NextRequest } from 'next/server';

import { updateSession } from '@/lib/supabase/proxy-session';

/**
 * Runs before admin routes. It refreshes the Supabase session and sends signed-out visitors to the
 * login screen. Admin pages still verify the admin role on the server, so this is not the only gate.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ['/admin/:path*'],
};
