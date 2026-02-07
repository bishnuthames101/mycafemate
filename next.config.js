const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
    // Cache strategies for different resource types
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "images-cache",
          expiration: {
            maxEntries: 64,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },
      {
        urlPattern: /^https:\/\/.*\.(?:js|css)$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-resources",
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          },
        },
      },
      {
        urlPattern: /^https:\/\/.*\/api\/.*$/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "api-cache",
          networkTimeoutSeconds: 10,
          expiration: {
            maxEntries: 16,
            maxAgeSeconds: 5 * 60, // 5 minutes
          },
        },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable instrumentation for environment validation on startup
  experimental: {
    instrumentationHook: true,
    // Externalize Prisma and pg from webpack bundling - they are server-only Node.js packages
    // Prevents @prisma/get-platform glob from scanning Windows junction points (EPERM)
    serverComponentsExternalPackages: ['@prisma/client', '@prisma/get-platform', 'prisma', 'pg', 'bcryptjs'],
  },
  // Skip ESLint during builds to avoid Windows EPERM on junction points
  // Run `npx next lint` separately instead
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Skip type checking during builds (run tsc separately)
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.mycafemate.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
    ],
  },
  // Security headers for production
  async headers() {
    // In development, allow subdomains for multi-tenant setup
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const formAction = isDevelopment
      ? `form-action 'self' http://*.localhost:3000`
      : `form-action 'self'`;

    // Only upgrade to HTTPS in production
    const upgradeInsecure = isDevelopment ? '' : 'upgrade-insecure-requests;';

    const connectSrc = isDevelopment
      ? "connect-src 'self' https: http://*.localhost:3000"
      : "connect-src 'self' https://*.mycafemate.com https://*.ingest.sentry.io";

    const ContentSecurityPolicy = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https: blob:;
      font-src 'self' data:;
      ${connectSrc};
      worker-src 'self';
      frame-ancestors 'self';
      base-uri 'self';
      ${formAction};
      ${upgradeInsecure}
    `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()'
          }
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    const path = require('path');

    // Ignore next-auth CSS
    config.resolve.alias = {
      ...config.resolve.alias,
      'next-auth/css': false,
    };

    // Prevent webpack from following symlinks/junctions (fixes Windows EPERM on junction points)
    config.resolve.symlinks = false;

    // Restrict module resolution to project node_modules only
    // Prevents webpack from scanning C:\Users\Dell\.node_modules etc. which hits Windows junction points
    config.resolve.modules = [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'src'),
    ];

    // Also restrict loader resolution
    config.resolveLoader = {
      ...(config.resolveLoader || {}),
      modules: [path.resolve(__dirname, 'node_modules')],
    };

    // Fix Windows permission issues - restrict snapshot scanning to node_modules only
    config.snapshot = {
      ...(config.snapshot || {}),
      managedPaths: [/^(.+?[\\/]node_modules[\\/])/],
    };

    return config;
  },
}

module.exports = withPWA(nextConfig);
