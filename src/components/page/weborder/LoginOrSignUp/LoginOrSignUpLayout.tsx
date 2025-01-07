import { Divider, VStack, Text } from '@chakra-ui/react';
import { useCallback } from 'react';

import { PrimaryButton, PrimaryTextColorButton } from '@/components/ui/Button';
import { useTenantRouter, useUsingOriginalIdProvider } from '@/providers/tenant/WebOrderPageStateProvider';
import { loginPage, signUpPage } from '@/utils/paths/tenantPages';
import { useRedirectIfAuthenticated } from '@/auth/hooks';
import { InsideNavbar } from '@/components/ui/InsideNavbar';
import variables from '@/styles/variables.module.scss';

import { GetLoginOrSignUpPageQuery } from './LoginOrSignUp.query.generated';

type Props = {
  data: GetLoginOrSignUpPageQuery;
  backTo: string;
};

export const LoginOrSignUpLayout = ({ data, backTo }: Props) => {
  const usingOriginalIdProvider = useUsingOriginalIdProvider();
  useRedirectIfAuthenticated({ backTo });

  const { idProviderName } = data.tenant;

  return (
    <>
      <InsideNavbar title="ログインまたは新規登録する" />
      <VStack
        mx="auto"
        py="24px"
        px={{
          base: '20px',
          md: '0px',
        }}
        spacing="16px"
        maxW={variables.containerMaxWidth}
      >
        <Text py="16px" w="full">
          登録は3分くらいでかんたんに完了します。すべての機能をご利用いただくために、ぜひご登録ください
        </Text>
        <GoToSignUpButton idProviderName={idProviderName} backTo={backTo} />
        <Divider py="0px" />
        <VStack w="full" alignItems="start" spacing="16px">
          <Text className="bold" mt="8px">
            {idProviderName}をお持ちですか？
          </Text>
          {!usingOriginalIdProvider && (
            <Text>
              {idProviderName}をお持ちの場合、Chompyですでに登録している住所や支払い方法をそのまま使うことができます💡
            </Text>
          )}
        </VStack>
        <GoToLoginButton idProviderName={idProviderName} backTo={backTo} />
      </VStack>
    </>
  );
};

const GoToSignUpButton = ({ idProviderName, backTo }: { idProviderName: string; backTo: string }) => {
  const router = useTenantRouter();

  const handleClick = useCallback(() => {
    router.push(signUpPage(backTo));
  }, [router, backTo]);

  return (
    <PrimaryButton minH="56px" onClick={handleClick}>
      {idProviderName}を新規登録する
    </PrimaryButton>
  );
};

const GoToLoginButton = ({ idProviderName, backTo }: { idProviderName: string; backTo: string }) => {
  const router = useTenantRouter();

  const handleClick = useCallback(() => {
    router.push(loginPage(backTo));
  }, [router, backTo]);

  return (
    <PrimaryTextColorButton minH="56px" onClick={handleClick}>
      {idProviderName}でログイン
    </PrimaryTextColorButton>
  );
};
