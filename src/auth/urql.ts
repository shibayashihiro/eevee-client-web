import type { AuthConfig, AuthUtilities } from '@urql/exchange-auth';

import { APIErrorCodes } from '@/utils/errors';

import { Auth } from '.';

export const getAuthExchangeConfig =
  ({ getCurrentUser, signOut }: Auth) =>
  async (utils: AuthUtilities): Promise<AuthConfig> => {
    // called on initial launch
    const user = getCurrentUser();
    let token = await user?.getIdToken();

    return {
      addAuthToOperation(operation) {
        if (token) {
          return utils.appendHeaders(operation, {
            Authorization: `Bearer ${token}`,
          });
        }
        return operation;
      },
      willAuthError(_operation) {
        return !token;
      },
      didAuthError(error, _operation) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          return true;
        }
        return error.graphQLErrors.some((e) => e.extensions?.code === APIErrorCodes.Unauthorized);
      },
      async refreshAuth() {
        const user = getCurrentUser();
        if (user !== null) {
          token = await user.getIdToken();
        } else {
          await signOut();
        }
      },
    };
  };
