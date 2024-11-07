import React, { Suspense } from 'react';
import { Container } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { GetLayout } from '@/types';
import variables from '@/styles/variables.module.scss';
import ErrorBoundary from '@/components/ErrorBoundary';
import { TenantPageProvider } from '@/providers/tenant/TenantPageProvider';
import { apps } from '@/apps';
import { validateQueryTenantIdentifier } from '@/utils/validator';

export const WebOrderLayout: GetLayout = (page) => {
  const router = useRouter();
  const cfg = validateQueryTenantIdentifier(router.query) ? apps.getConfig(router.query.tenantIdentifier) : null;

  return (
    <TenantPageProvider>
      <ErrorBoundary>
        <Suspense>
          <Container maxWidth={cfg?.promotionEnabled ? variables.containerMaxWidth : variables.pageMaxWidth} p="0">
            {page}
          </Container>
        </Suspense>
      </ErrorBoundary>
    </TenantPageProvider>
  );
};
