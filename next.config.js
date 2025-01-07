/* eslint-disable @typescript-eslint/no-require-imports */

const path = require('path');

const { withSentryConfig } = require('@sentry/nextjs');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const env = {
  ...require(`./config/${process.env.APP_ENV || 'local'}.json`),
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.FUNCTIONS === 'true' ? 'standalone' : 'export', // functionsで動かす時はstandaloneにする必要がある。
  distDir: process.env.FUNCTIONS === 'true' ? 'functions/.next' : undefined,
  reactStrictMode: true,
  trailingSlash: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
  },
  env,
  experimental: {
    scrollRestoration: true,
  },
};

let config = withBundleAnalyzer(nextConfig);

if (env.NEXT_PUBLIC_SENTRY_ENABLED === 'true') {
  console.info('[INFO]Sentry enabled');
  // Injected content via Sentry wizard below
  config = withSentryConfig(config, {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    org: 'syn-inc',
    project: 'eevee-client-web',

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    // tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: process.env.APP_ENV === 'production',

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  });
}

module.exports = config;
