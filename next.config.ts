import type { NextConfig } from 'next';

const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * Resolves the Supabase project origin so image optimisation and the Content-Security-Policy
 * can reference it. Returns null until NEXT_PUBLIC_SUPABASE_URL is configured.
 */
function getSupabaseUrl(): URL | null {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!rawUrl) return null;

  try {
    return new URL(rawUrl);
  } catch {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL must be a valid absolute URL.');
  }
}

const supabaseUrl = getSupabaseUrl();

function buildContentSecurityPolicy(): string {
  const supabaseOrigin = supabaseUrl?.origin ?? '';

  return [
    "default-src 'self'",
    // Next.js inlines small bootstrap scripts. Nonces would force every page to render per request
    // and remove static caching, so we keep 'unsafe-inline' and rely on React's escaping instead.
    `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ''}`,
    // The site never uses inline event handler attributes such as onclick, so they are blocked.
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self' ${supabaseOrigin}${isDevelopment ? ' ws:' : ''}`.trimEnd(),
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "worker-src 'none'",
    "manifest-src 'self'",
    ...(isDevelopment ? [] : ['upgrade-insecure-requests']),
  ].join('; ');
}

const securityHeaders = [
  { key: 'Content-Security-Policy', value: buildContentSecurityPolicy() },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
  { key: 'Origin-Agent-Cluster', value: '?1' },
  ...(isDevelopment
    ? []
    : [
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      ]),
];

const adminHeaders = [
  { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
  { key: 'Cache-Control', value: 'private, no-store' },
];

// Photos in public/images change rarely, so browsers keep them for a week and revalidate in the background.
const staticImageHeaders = [
  { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=2592000' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Product photos are capped at 5 MB in the server action; leave headroom for multipart overhead.
    serverActions: { bodySizeLimit: '6mb' },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // Optimised images are reused for a day instead of the default minute, so Supabase photos are not re-processed constantly.
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: supabaseUrl
      ? [
          {
            protocol: supabaseUrl.protocol === 'http:' ? 'http' : 'https',
            hostname: supabaseUrl.hostname,
            port: supabaseUrl.port,
            pathname: '/storage/v1/object/public/**',
          },
        ]
      : [],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/admin/:path*', headers: adminHeaders },
      { source: '/images/:path*', headers: staticImageHeaders },
    ];
  },
};

export default nextConfig;
