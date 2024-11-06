import { createContext, FC, useCallback, useContext, useState } from 'react';
import { Provider as UrqlProvider } from 'urql';
import liff from '@line/liff';

import { createClient } from '@/graphql/client';
import { useAuth } from '@/auth/provider/AuthProvider';

type State = {
  resetClient: () => void;
};

const UrqlClientContext = createContext<State | undefined>(undefined);

export const useUrqlClient = () => {
  const context = useContext(UrqlClientContext);
  if (context === undefined) {
    throw new Error('useUrqlClient must be used within a UrqlClientProvider');
  }
  return context;
};

type Props = {
  children: React.ReactNode;
  tenantId: string;
  authProject?: string;
};

/**
 * tenantIdやUserが切り替わったときにclientを再生成したい（キャッシュを破棄したい）ため
 * clientを保持 & コントロールする機構を提供する。
 */
export const UrqlClientProvider: FC<Props> = ({ tenantId, children }) => {
  const auth = useAuth();

  const [currentTenantId] = useState(tenantId);
  const [client, setClient] = useState(
    createClient({
      tenantId: currentTenantId,
      auth,
      liffId: liff.id,
    }),
  );

  const resetClient = useCallback(() => {
    setClient(
      createClient({
        tenantId: currentTenantId,
        auth,
        liffId: liff.id,
      }),
    );
  }, [auth, currentTenantId]);

  const contextValue = {
    resetClient,
  };

  return (
    <UrqlClientContext.Provider value={contextValue}>
      <UrqlProvider value={client}>{children}</UrqlProvider>
    </UrqlClientContext.Provider>
  );
};
