import { Checkbox, FormControl, HStack, Text, VStack } from '@chakra-ui/react';
import { FC, useCallback, useMemo, useState } from 'react';

import { PrimaryButton } from '@/components/ui/Button';
import { InputPassword, InputWithLabel } from '@/components/ui/Input';
import { WrappedLink } from '@/components/ui/WrappedLink';
import { useShowAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { generateMutationId } from '@/graphql/helper';
import { passwordResetPage, privacyPage, signUpPage } from '@/utils/paths/tenantPages';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { useAuth } from '@/auth/provider/AuthProvider';

import { TenantPageLink } from '../TenantPageLink';

import { useSignInMutation } from './LoginForm.mutation.generated';

type Props = {
  backTo: string;
};

const useSignIn = (): {
  loading: boolean;
  signIn: (email: string, password: string) => Promise<Error | void>;
} => {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [_, signInForApp] = useSignInMutation();

  const handleSignIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const { err } = await signIn(email, password);
        if (err) {
          return err;
        }
        const { error } = await signInForApp({
          input: {
            clientMutationId: generateMutationId(),
          },
        });
        if (error) {
          return error;
        }
      } finally {
        setLoading(false);
      }
    },
    [signIn, signInForApp],
  );

  return {
    loading: loading,
    signIn: handleSignIn,
  };
};

export const LoginForm: FC<Props> = ({ backTo }: Props) => {
  const router = useTenantRouter();
  const { showAlertDialog } = useShowAlertDialog();
  const { loading, signIn } = useSignIn();
  useLoadingOverlay(loading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);

  const loginButtonEnabled = useMemo(() => agree && email !== '' && password !== '', [email, password, agree]);

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleChangeAgree = (e: React.ChangeEvent<HTMLInputElement>) => setAgree(e.target.checked);

  const handleSignIn = useCallback(async () => {
    const err = await signIn(email, password);
    if (err) {
      showAlertDialog(err.message);
      return;
    }
    router.push(backTo);
  }, [email, password, router, showAlertDialog, signIn, backTo]);

  return (
    <>
      <FormControl>
        <VStack spacing="24px">
          <InputWithLabel
            w="full"
            id="email"
            label="メールアドレス"
            placeholder="food@chompy.com"
            value={email}
            onChange={handleChangeEmail}
          />
          <InputPassword w="full" id="password" label="パスワード" value={password} onChange={handleChangePassword} />
        </VStack>
        <Text w="full" className="bold-extra-small" align="right" mt="16px">
          <TenantPageLink href={passwordResetPage} color="brand.primaryText">
            😢 パスワードを忘れてしまった
          </TenantPageLink>
        </Text>
      </FormControl>

      <VStack spacing="24px" w="full">
        <HStack>
          <Checkbox colorScheme="brand" size="lg" onChange={handleChangeAgree} />
          <Text>
            <WrappedLink
              color="brand.primaryText"
              href="https://chompy.notion.site/1a5b395ee0074dbc894fb23f81da03fd"
              isExternal
            >
              サービス利用規約
            </WrappedLink>
            、
            <TenantPageLink color="brand.primaryText" href={privacyPage} target="_blank">
              プライバシーポリシー
            </TenantPageLink>
            に同意します。
          </Text>
        </HStack>
        <PrimaryButton disabled={!loginButtonEnabled} onClick={handleSignIn}>
          ログイン
        </PrimaryButton>
        <Text className="bold-extra-small" color="mono.secondary">
          アカウントを持っていない場合
          <TenantPageLink color="brand.primaryText" href={signUpPage(backTo)}>
            登録はこちら
          </TenantPageLink>
        </Text>
      </VStack>
    </>
  );
};
