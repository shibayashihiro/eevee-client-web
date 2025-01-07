import { ParsedUrlQuery } from 'querystring';

import { NextPageWithLayout } from '@/types';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { home } from '@/utils/paths/tenantPages';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

import { LoginOrSignUpLayout } from './LoginOrSignUpLayout';
import { useGetLoginOrSignUpPageQuery } from './LoginOrSignUp.query.generated';

type ExpectedQuery = {
  src?: string;
};

const isExpectedQuery = (query: ParsedUrlQuery): query is ExpectedQuery => {
  return typeof query.src === 'string' || query.src === undefined;
};

export const LoginOrSignUp: NextPageWithLayout = () => {
  const router = useTenantRouter();

  const backTo = isExpectedQuery(router.query) ? (router.query.src ?? home) : home;

  const [{ data, error, fetching }] = useGetLoginOrSignUpPageQuery();
  if (fetching) {
    return <LoadingSpinner />;
  }
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error('not found');
  }
  return <LoginOrSignUpLayout data={data} backTo={backTo} />;
};
