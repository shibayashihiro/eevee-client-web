import { FirebaseAuthProject } from '@/auth';
import { AuthProvider } from '@/auth/provider/AuthProvider';
import { AuthUserProvider } from '@/auth/provider/AuthUserProvider';

import { UrqlClientProvider } from './UrqlClientProvider';

type Props = {
  // 生のTenantID
  tenantId: string;
  authProject: FirebaseAuthProject;
  children: React.ReactNode;
};

// urqlのclientとAuthの処理が割と密接なので、まとめて提供するProvider
export const AuthWithUrqlClientProvider = ({ tenantId, authProject, children }: Props) => {
  return (
    <AuthProvider authProject={authProject}>
      <UrqlClientProvider tenantId={tenantId}>
        <AuthUserProvider tenantId={tenantId}>{children}</AuthUserProvider>
      </UrqlClientProvider>
    </AuthProvider>
  );
};
