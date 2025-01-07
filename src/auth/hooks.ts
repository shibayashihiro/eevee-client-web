import { useEffect } from 'react';

import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';

import { useAuth } from './provider/AuthProvider';

/**
 * 認証済みの場合に指定したページにリダイレクトする
 */
export const useRedirectIfAuthenticated = ({ backTo }: { backTo: string }) => {
  const { onAuthStateChanged } = useAuth();
  const router = useTenantRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (user && !user.isAnonymous) {
        console.log('redirect to', backTo);
        router.replace(encodeURI(backTo));
      }
    });
    return () => unsubscribe();
  }, [backTo, onAuthStateChanged, router]);
};
