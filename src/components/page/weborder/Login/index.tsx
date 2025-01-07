import { ParsedUrlQuery } from 'querystring';

import { NextPageWithLayout } from '@/types';
import { InsideNavbar } from '@/components/ui/InsideNavbar';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { home } from '@/utils/paths/tenantPages';

import { LoginLayout } from './LoginLayout';

type ExpectedQuery = {
  src?: string;
};

const isExpectedQuery = (query: ParsedUrlQuery): query is ExpectedQuery => {
  return typeof query.src === 'string' || query.src === undefined;
};

export const LoginPage: NextPageWithLayout = () => {
  const router = useTenantRouter();

  const backTo = isExpectedQuery(router.query) ? (router.query.src ?? home) : home;

  return (
    <>
      <InsideNavbar title="ログイン" />
      <LoginLayout backTo={backTo} />
    </>
  );
};
