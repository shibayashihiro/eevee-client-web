import { useCallback, useMemo } from 'react';
import { NextRouter, useRouter } from 'next/router';

import { Url, wrapUrl } from '@/utils/url';

import { useTenantIdentifier } from '.';

type AppRouterOption = {
  isExternal?: boolean;
};

type AppRouter = Omit<NextRouter, 'push' | 'replace'> & {
  asPath: string;
  push: (url: Url, option?: AppRouterOption) => ReturnType<NextRouter['push']>;
  replace: (url: Url, option?: AppRouterOption) => ReturnType<NextRouter['replace']>;
};

export const useTenantRouter = (): AppRouter => {
  const router = useRouter();
  const tenantIdentifier = useTenantIdentifier();

  const basePath = `/${tenantIdentifier}`;

  const push = useCallback(
    (url: Url, option?: AppRouterOption) => {
      if (option?.isExternal) {
        return router.push(url);
      }
      return router.push(wrapUrl(url, basePath));
    },
    [router, basePath],
  );

  const replace = useCallback(
    (url: Url, option?: AppRouterOption) => {
      if (option?.isExternal) {
        return router.replace(url);
      }
      return router.replace(wrapUrl(url, basePath));
    },
    [router, basePath],
  );

  const appRouter = useMemo(
    () => ({
      ...router,
      asPath: router.asPath.replace(basePath, ''),
      push,
      replace,
    }),
    [router, basePath, push, replace],
  );

  return appRouter;
};
