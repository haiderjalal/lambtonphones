import type { Metadata, Viewport } from 'next';
import { Fraunces, Geist } from 'next/font/google';
import type { ReactNode } from 'react';

import '@/styles/globals.css';

import { SITE_DEFAULT_DESCRIPTION, SITE_NAME } from '@/constants/site';
import { getPublicEnv } from '@/lib/env/public';

// Fraunces sets headlines with a soft, editorial serif. Geist keeps body and interface text clean.
const fontDisplay = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(getPublicEnv().NEXT_PUBLIC_SITE_URL),
  title: {
    default: `${SITE_NAME} | Phone, Tablet & Laptop Repairs in Newcastle`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    siteName: SITE_NAME,
    locale: 'en_AU',
    type: 'website',
  },
  icons: {
    icon: '/icon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#111714',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en-AU"
      className={`${fontDisplay.variable} ${fontSans.variable} h-full antialiased`}
    >
      <body className="min-h-dvh font-sans">
        {children}
        {/* Without JavaScript, scroll-reveal content must still be visible. */}
        <noscript>
          <style>{'.reveal,.reveal-3d{opacity:1!important;transform:none!important}'}</style>
        </noscript>
      </body>
    </html>
  );
}
