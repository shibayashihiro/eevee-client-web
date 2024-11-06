import { captureException } from '@sentry/nextjs';
import { Client, createClient as createUrqlClient } from 'urql';
import { authExchange } from '@urql/exchange-auth';
import { cacheExchange, fetchExchange, mapExchange } from 'urql';

import { APIErrorCodes } from '@/utils/errors';
import { Auth } from '@/auth';
import { getAuthExchangeConfig } from '@/auth/urql';

const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://0.0.0.0:4000/graphql';

type ClientOption = {
  // Tenant ID
  tenantId: string;
  // 認証インスタンス
  auth: Auth;
  // LINEミニアプリ(LIFF)のID。liff.initに使用したもの。
  liffId?: string | null;
};

export const createClient = ({ tenantId, auth, liffId }: ClientOption): Client => {
  const headers: { [key: string]: string } = {
    'x-syn-app-tenant-uid': tenantId,
  };
  if (liffId) {
    headers['x-syn-app-liff-id'] = liffId;
  }

  return createUrqlClient({
    url: endpoint,
    exchanges: makeExchanges(auth),
    fetchOptions: {
      headers,
    },
  });
};

const makeExchanges = (auth: Auth) => {
  // The authExchange is an asynchronous exchange, so it must be placed in front of all fetchExchanges
  // but after all other synchronous exchanges, like the cacheExchange.
  const exchanges = [
    cacheExchange,
    authExchange(getAuthExchangeConfig(auth)),
    mapExchange({
      onError(error, _) {
        if (error.graphQLErrors) {
          if (error.graphQLErrors.some((e) => e.extensions?.code === APIErrorCodes.Unauthorized)) {
            // FirebaseTokenのRefreshでも良いのだが、LINEミニアプリの場合はFirebaseとしてではなく
            // LINEの再認証をおこないたいため、一度User情報を削除する
            return auth.signOut();
          }
          const allErrIsIgnore = error.graphQLErrors.every(
            ({ extensions }) =>
              extensions?.code === APIErrorCodes.InvalidRequest || extensions?.code === APIErrorCodes.NotFound,
          );
          if (allErrIsIgnore) {
            return;
          }
        }
        captureException(error);
      },
    }),
    fetchExchange,
  ];

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { devtoolsExchange } = require('@urql/devtools');
    return [devtoolsExchange, ...exchanges];
  }
  return exchanges;
};
