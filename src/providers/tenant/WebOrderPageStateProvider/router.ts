import { useCallback, useMemo } from 'react';
import { NextRouter, useRouter } from 'next/router';

import { isExternalLink, wrapUrl } from '@/utils/url';

import { useTenantIdentifier } from '.';

type RouterPushFn = NextRouter['push'];
type RouterReplaceFn = NextRouter['replace'];

type AppRouter = Omit<NextRouter, 'push' | 'replace'> & {
  asPath: string;
  push: RouterPushFn;
  replace: RouterReplaceFn;
};

export const useTenantBasePath = (): string => {
  const tenantIdentifier = useTenantIdentifier();
  return `/${tenantIdentifier}`;
};

export const useTenantRouter = (): AppRouter => {
  const router = useRouter();
  const basePath = useTenantBasePath();

  const push = useCallback(
    (...args: Parameters<RouterPushFn>) => {
      const [url, as, options] = args;
      if (isExternalLink(url)) {
        return router.push(url, as, options);
      }
      return router.push(wrapUrl(url, basePath), as, options);
    },
    [router, basePath],
  );

  const replace = useCallback(
    (...args: Parameters<RouterReplaceFn>) => {
      const [url, as, options] = args;
      if (isExternalLink(url)) {
        return router.replace(url, as, options);
      }
      return router.replace(wrapUrl(url, basePath), as, options);
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
