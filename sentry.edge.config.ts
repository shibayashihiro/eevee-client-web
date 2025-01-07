// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true') {
  Sentry.init({
    dsn: 'https://7898c6f215ad83bb356d3ffadcd35b8c@o443453.ingest.us.sentry.io/4507689492152320',
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
    enabled: process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true',

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
  });
}
