import { Checkbox, FormControl, HStack, Text, VStack } from '@chakra-ui/react';
import { useCallback, useState } from 'react';

import { PrimaryButton } from '@/components/ui/Button';
import { InputPassword, InputWithLabel } from '@/components/ui/Input';
import { WrappedLink } from '@/components/ui/WrappedLink';
import { useHandleErrorWithAlertDialog, useShowAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { generateMutationId } from '@/graphql/helper';
import { passwordResetPage, privacyPage, signUpPage } from '@/utils/paths/tenantPages';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { TenantPageLink } from '@/components/domain/TenantPageLink';
import { useAuth } from '@/auth/provider/AuthProvider';
import variables from '@/styles/variables.module.scss';
import { containerMarginX } from '@/utils/constants';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';

import { useSignInMutation } from './Login.mutation.generated';
import { useGetLoginPageQuery } from './Login.query.generated';

type Props = {
  backTo: string;
};

export const LoginLayout = ({ backTo }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [result] = useGetLoginPageQuery();

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleChangeAgree = (e: React.ChangeEvent<HTMLInputElement>) => setAgree(e.target.checked);
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const { data, fetching, error } = result;
  useLoadingOverlay(fetching);
  if (error) {
    handleErrorWithAlertDialog(error);
  }
  if (fetching) {
    return null;
  }
  if (!data) {
    throw new Error('not found');
  }

  const { termsOfUseUrl, privacyPolicyUrl } = data.viewing;
  return (
    <VStack pt="24px" px={containerMarginX} pb="32px" spacing="16px" mx="auto" maxW={variables.containerMaxWidth}>
      <FormControl>
        <VStack spacing="24px">
          <InputWithLabel
            w="full"
            id="email"
            label="メールアドレス"
            placeholder="mail@example.com"
            value={email}
            onChange={handleChangeEmail}
          />
          <InputPassword w="full" id="password" label="パスワード" value={password} onChange={handleChangePassword} />
        </VStack>
        <Text w="full" className="bold-extra-small" align="right" mt="16px">
          <TenantPageLink href={passwordResetPage} color="brand.primaryText">
            パスワードを忘れてしまった
          </TenantPageLink>
        </Text>
      </FormControl>

      <VStack spacing="24px" w="full">
        <HStack>
          <Checkbox colorScheme="brand" size="lg" onChange={handleChangeAgree} />
          <Text>
            <WrappedLink color="brand.primaryText" href={termsOfUseUrl} isExternal>
              サービス利用規約
            </WrappedLink>
            、
            {privacyPolicyUrl ? (
              <WrappedLink color="brand.primaryText" href={privacyPolicyUrl} isExternal>
                プライバシーポリシー
              </WrappedLink>
            ) : (
              <TenantPageLink color="brand.primaryText" href={privacyPage} target="_blank">
                プライバシーポリシー
              </TenantPageLink>
            )}
            に同意します。
          </Text>
        </HStack>
        <LoginButton email={email} password={password} agreeTermsAndPrivacyPolicy={agree} backTo={backTo} />
        <Text className="bold-extra-small" color="mono.secondary">
          アカウントを持っていない場合
          <TenantPageLink color="brand.primaryText" href={signUpPage(backTo)}>
            登録はこちら
          </TenantPageLink>
        </Text>
      </VStack>
    </VStack>
  );
};

const LoginButton = ({
  email,
  password,
  agreeTermsAndPrivacyPolicy,
  backTo,
}: {
  email: string;
  password: string;
  agreeTermsAndPrivacyPolicy: boolean;
  backTo: string;
}) => {
  const router = useTenantRouter();
  const { signIn } = useAuth();
  const { showAlertDialog } = useShowAlertDialog();
  const [_, signInForApp] = useSignInMutation();

  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    setLoading(true);
    try {
      const { err } = await signIn(email, password);
      if (err) {
        showAlertDialog(err.message);
        return;
      }
      const { error } = await signInForApp({
        input: {
          clientMutationId: generateMutationId(),
        },
      });
      if (error) {
        showAlertDialog(error.message);
        return;
      }
      router.push(backTo);
    } finally {
      setLoading(false);
    }
  }, [backTo, email, password, router, showAlertDialog, signIn, signInForApp]);

  const inputIsValid = agreeTermsAndPrivacyPolicy && email !== '' && password !== '';
  return (
    <PrimaryButton disabled={!inputIsValid} isLoading={loading} onClick={handleClick}>
      ログイン
    </PrimaryButton>
  );
};
