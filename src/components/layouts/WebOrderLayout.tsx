import React, { Suspense } from 'react';
import { Container } from '@chakra-ui/react';

import { GetLayout } from '@/types';
import variables from '@/styles/variables.module.scss';
import ErrorBoundary from '@/components/ErrorBoundary';
import { TenantPageProvider } from '@/providers/tenant/TenantPageProvider';

export const WebOrderLayout: GetLayout = (page) => {
  return (
    <TenantPageProvider>
      <ErrorBoundary>
        <Suspense>
          {/* defaultでpaddingが設定されてしまうため p=0 する */}
          <Container maxWidth={variables.containerMaxWidth} p="0">
            {page}
          </Container>
        </Suspense>
      </ErrorBoundary>
    </TenantPageProvider>
  );
};
