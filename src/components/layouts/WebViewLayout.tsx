import { ParsedUrlQuery } from 'querystring';

import { ChakraProvider } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { GetLayout } from '@/types';
import { AuthWithUrqlClientProvider } from '@/providers/AuthWithUrqlClientProvider';
import { GlobalLoadingSpinnerProvider } from '@/providers/GlobalLoadingSpinnerProvider';

import ErrorBoundary from '../ErrorBoundary';

type ExpectedQuery = {
  tenantId: string;
};

const isValidQueryParam = (query: ParsedUrlQuery): query is ExpectedQuery => {
  const { tenantId } = query;
  return typeof tenantId === 'string';
};

export const WebViewLayout: GetLayout = (page) => {
  const router = useRouter();
  const { query, isReady } = router;
  if (!isReady) {
    return null;
  }
  if (isReady && !isValidQueryParam(query)) {
    router.replace('/404');
    return null;
  }
  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0" />
      </Head>
      <ChakraProvider>
        <ErrorBoundary>
          <GlobalLoadingSpinnerProvider>
            <AuthWithUrqlClientProvider tenantId={query.tenantId as string} authProject="default">
              {page}
            </AuthWithUrqlClientProvider>
          </GlobalLoadingSpinnerProvider>
        </ErrorBoundary>
      </ChakraProvider>
    </>
  );
};
