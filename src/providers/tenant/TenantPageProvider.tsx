import React, { FC } from 'react';
import Head from 'next/head';
import { NextRouter, useRouter } from 'next/router';

import { WebOrderPageStateProvider } from '@/providers/tenant/WebOrderPageStateProvider';
import { ChakraWithThemeProvider } from '@/providers/tenant/ChakraWithThemeProvider';
import { OrderType } from '@/graphql/generated/types';
import { validateQueryTenantIdentifier } from '@/utils/validator';
import { apps } from '@/apps';

import { GlobalLoadingSpinnerProvider } from '../GlobalLoadingSpinnerProvider';
import { LIFFProvider } from '../LIFFProvider';
import { AuthWithUrqlClientProvider } from '../AuthWithUrqlClientProvider';

import { GlobalDialogProvider } from './GlobalModalDialogProvider';

const resolveOrderType = (router: NextRouter): OrderType | undefined => {
  const { orderType } = router.query;
  if (orderType === OrderType.EatIn) {
    return OrderType.EatIn;
  }
  if (orderType === OrderType.Delivery) {
    return OrderType.Delivery;
  }
  if (orderType === OrderType.Takeout) {
    return OrderType.Takeout;
  }
  const lastPath = router.pathname.split('/').pop();
  switch (lastPath) {
    case 'eatin':
      return OrderType.EatIn;
    case 'delivery':
      return OrderType.Delivery;
    case 'takeout':
      return OrderType.Takeout;
  }
  return undefined;
};

type Props = {
  children: React.ReactNode;
};

/**
 * TenantIdentifier以下のページに必要なProviderをまとめて提供する
 * @param param
 * @returns
 */
export const TenantPageProvider: FC<Props> = ({ children }) => {
  const router = useRouter();
  const cfg = validateQueryTenantIdentifier(router.query) ? apps.getConfig(router.query.tenantIdentifier) : null;

  if (!cfg) {
    return null;
  }

  if (!validateQueryTenantIdentifier(router.query)) {
    throw new Error('invalid path');
  }

  const orderType = resolveOrderType(router);

  const { tenantIdentifier, facilityId } = router.query;
  const { title, favicon } = cfg.pageMeta;

  const firebaseAuthProject = cfg.firebaseAuthProject ?? 'default';
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href={favicon} />
      </Head>
      <WebOrderPageStateProvider
        tenantIdentifier={tenantIdentifier}
        tenantUid={cfg.tenantUidHeader}
        facilityId={facilityId}
        orderType={orderType}
        uiCustomization={cfg.uiCustomization}
        usingOriginalIdProvider={firebaseAuthProject !== 'default'}
      >
        <ChakraWithThemeProvider appColor={cfg.appColor}>
          <GlobalLoadingSpinnerProvider>
            <GlobalDialogProvider>
              <LIFFProvider liffId={cfg.liffId ?? null}>
                <AuthWithUrqlClientProvider tenantId={cfg.tenantUidHeader} authProject={firebaseAuthProject}>
                  {children}
                </AuthWithUrqlClientProvider>
              </LIFFProvider>
            </GlobalDialogProvider>
          </GlobalLoadingSpinnerProvider>
        </ChakraWithThemeProvider>
      </WebOrderPageStateProvider>
    </>
  );
};
