import { createContext, useContext, useMemo } from 'react';

import { getAuth, Auth, FirebaseAuthProject } from '@/auth';

const FirebaseAuthContext = createContext<Auth | null>(null);

export const useAuth = () => {
  const auth = useContext(FirebaseAuthContext);
  if (!auth) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return auth;
};

type Props = {
  authProject: FirebaseAuthProject;
  children: React.ReactNode;
};

export const AuthProvider = ({ authProject, children }: Props) => {
  const auth = useMemo(() => getAuth(authProject), [authProject]);
  return <FirebaseAuthContext.Provider value={auth}>{children}</FirebaseAuthContext.Provider>;
};
