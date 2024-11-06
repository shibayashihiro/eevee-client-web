import { ChakraProvider } from '@chakra-ui/react';
import Head from 'next/head';
import { Suspense } from 'react';

import { GetLayout } from '@/types';

import ErrorBoundary from '../ErrorBoundary';

export const DemoLayout: GetLayout = (page) => {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0" />
      </Head>
      <ChakraProvider>
        <ErrorBoundary>
          <Suspense fallback={null}>{page}</Suspense>
        </ErrorBoundary>
      </ChakraProvider>
    </>
  );
};
