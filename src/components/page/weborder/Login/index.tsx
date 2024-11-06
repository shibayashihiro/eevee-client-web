import { ParsedUrlQuery } from 'querystring';

import { VStack } from '@chakra-ui/react';
import { useCallback, useState } from 'react';

import { NextPageWithLayout } from '@/types';
import { LoginTop } from '@/components/domain/LoginTop';
import { LoginForm } from '@/components/domain/LoginForm';
import { containerMarginX } from '@/utils/constants';
import { InsideNavbar } from '@/components/ui/InsideNavbar';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { home } from '@/utils/paths/tenantPages';

type ContentState = 'loginTop' | 'loginForm';

const titles: Record<ContentState, string> = {
  loginTop: 'ログインまたは新規登録する',
  loginForm: 'ログイン',
};

type ExpectedQuery = {
  src?: string;
};

const isExpectedQuery = (query: ParsedUrlQuery): query is ExpectedQuery => {
  return typeof query.src === 'string' || query.src === undefined;
};

const LoginPage: NextPageWithLayout = () => {
  const router = useTenantRouter();
  const [contentState, setContentState] = useState<ContentState>('loginTop');

  const backTo = isExpectedQuery(router.query) ? router.query.src ?? home : home;

  const handleClickBackIcon = useCallback(async () => {
    if (contentState === 'loginTop') {
      await router.replace(backTo);
      return;
    }
    if (contentState === 'loginForm') {
      setContentState('loginTop');
      return;
    }
  }, [backTo, contentState, router]);

  const handleClickLogin = useCallback(() => {
    setContentState('loginForm');
  }, []);

  const title = titles[contentState];

  return (
    <>
      <InsideNavbar title={title} onClickBackIcon={handleClickBackIcon} />
      <VStack mx={containerMarginX} pt="24px" spacing="16px">
        {contentState === 'loginTop' && <LoginTop onClickLogin={handleClickLogin} backTo={backTo} />}
        {contentState === 'loginForm' && <LoginForm backTo={backTo} />}
      </VStack>
    </>
  );
};

export default LoginPage;
