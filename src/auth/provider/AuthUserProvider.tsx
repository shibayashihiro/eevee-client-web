import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import liff from '@line/liff';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

import { useUrqlClient } from '../../providers/AuthWithUrqlClientProvider/UrqlClientProvider';

import { useAuth } from './AuthProvider';

export type User = {
  id: string;
  isAnonymous: boolean;
  // 会員登録直後など、即座にonAuthStateChangedが働かないケースのためにreloadできる機構を提供する
  reload: () => Promise<void>;
};

type UserState = User | null;

const AuthUserContext = createContext<UserState>(null);

export const useAuthUser = () => {
  const user = useContext(AuthUserContext);
  if (!user) {
    throw new Error('useAuthUser must be used within a AuthUserProvider');
  }
  return user;
};

type Props = {
  tenantId: string;
  children: React.ReactNode;
};

export const AuthUserProvider = ({ tenantId, children }: Props) => {
  const [user, setUser] = useState<UserState>(null);
  const { onAuthStateChanged, signInAnonymously, signInByLINE, getCurrentUser } = useAuth();

  // 会員登録直後など、即座にonAuthStateChangedが働かないケースのためにreloadできる機構を提供する
  const reload = useCallback(async () => {
    const user = getCurrentUser();
    if (user) {
      await user.reload();
      setUser({
        id: user.uid,
        isAnonymous: user.isAnonymous,
        reload,
      });
    }
  }, [getCurrentUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (!user) {
        setUser(null);
        if (liff.isInClient()) {
          signInByLINE(tenantId);
          return;
        } else {
          signInAnonymously();
          return;
        }
      }
      setUser({
        id: user.uid,
        isAnonymous: user.isAnonymous,
        reload,
      });
    });

    return () => unsubscribe();
  }, [onAuthStateChanged, reload, signInAnonymously, signInByLINE, tenantId]);

  return (
    <AuthUserContext.Provider value={user}>
      <AuthGuard user={user}>{children}</AuthGuard>
    </AuthUserContext.Provider>
  );
};

const AuthGuard = ({ children, user }: { children: React.ReactNode; user: UserState }) => {
  const [lastUser, setLastUser] = useState<UserState>(null);
  const { resetClient } = useUrqlClient();

  useEffect(() => {
    // MEMO: 将来useEffectEventが使えるようになると、自前で変更検知しなくてもuserだけに反応するuseEffectを使えば処理を切り出せそう
    if (lastUser?.id !== user?.id) {
      // Userが切り替わったら、urqlのclientを再生成する
      resetClient();
      setLastUser(user);
    }
  }, [lastUser, resetClient, user]);

  if (!user) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};
