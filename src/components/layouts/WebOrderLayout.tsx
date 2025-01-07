import React, { Suspense } from 'react';

import { GetLayout } from '@/types';
import ErrorBoundary from '@/components/ErrorBoundary';
import { TenantPageProvider } from '@/providers/tenant/TenantPageProvider';

export const WebOrderLayout: GetLayout = (page) => {
  return (
    <TenantPageProvider>
      <ErrorBoundary>
        <Suspense>{page}</Suspense>
      </ErrorBoundary>
    </TenantPageProvider>
  );
};
