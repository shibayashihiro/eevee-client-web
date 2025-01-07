import { Text, Flex, VStack, HStack, Checkbox } from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';

import { InputPassword, InputWithLabel } from '@/components/ui/Input';
import { PrimaryButton } from '@/components/ui/Button';
import { WrappedLink } from '@/components/ui/WrappedLink';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { validateEmail } from '@/utils/validator';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { useAuthUser } from '@/auth/provider/AuthUserProvider';
import { useAuth } from '@/auth/provider/AuthProvider';
import { TenantPageLink } from '@/components/domain/TenantPageLink';
import { containerMarginX } from '@/utils/constants';
import { privacyPage } from '@/utils/paths/tenantPages';
import variables from '@/styles/variables.module.scss';

import { useSignUpMutation } from './SignUp.mutation.generated';
import { useStepperDispatch } from './StepperProvider';
import { useGetSignUpStepInputCredentialsPageQuery } from './SignUpStepInputCredentials.query.generated';

type Props = {
  phoneNumber: string;
};

export const SignUpStepInputCredentials = ({ phoneNumber }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);

  const { signIn } = useAuth();
  const { id: userId, reload } = useAuthUser();

  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();
  const [queryResult] = useGetSignUpStepInputCredentialsPageQuery();
  const [mutationResult, signUp] = useSignUpMutation();
  const { goToNextStep } = useStepperDispatch();
  useLoadingOverlay(queryResult.fetching);
  useLoadingOverlay(mutationResult.fetching);

  const isValid = useMemo(() => {
    if (email.length == 0 || password.length == 0 || !agree) {
      return false;
    }
    return validateEmail(email);
  }, [agree, email, password.length]);

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleChangeAgree = (e: React.ChangeEvent<HTMLInputElement>) => setAgree(e.target.checked);

  const handleClickNext = useCallback(async () => {
    if (!isValid) {
      return;
    }
    const { error } = await signUp({
      input: {
        anonymousUserID: userId,
        phoneNumber,
        email: email,
        password: password,
        // 以下の入力項目は、ナポリの窯さま対応以降不要になった。
        lastName: '',
        firstName: '',
        lastNameKana: '',
        firstNameKana: '',
      },
    });
    if (error) {
      handleErrorWithAlertDialog(error);
      return;
    }
    // 登録後、サインインする
    await signIn(email, password);
    // 登録後にonAuthStateChangedが即座に更新されないケースがあるため、自前でreloadする
    await reload();
    goToNextStep();
  }, [email, goToNextStep, handleErrorWithAlertDialog, isValid, password, phoneNumber, reload, signIn, signUp, userId]);

  const { data, fetching, error } = queryResult;
  if (error) {
    handleErrorWithAlertDialog(error);
  }
  if (fetching) {
    return null;
  }
  if (!data) {
    throw new Error('not found');
  }

  const agreementLinks: { text: string; url: string; isExternal: boolean }[] = [
    {
      text: 'サービス利用規約',
      url: data.viewing.termsOfUseUrl,
      isExternal: true,
    },
    data.viewing.privacyPolicyUrl
      ? { text: 'プライバシーポリシー', url: data.viewing.privacyPolicyUrl, isExternal: true }
      : { text: 'プライバシーポリシー', url: privacyPage, isExternal: false },
  ];

  return (
    <Flex direction="column" mx="auto" px={containerMarginX} maxW={variables.containerMaxWidth}>
      <VStack mt="32px" spacing="24px">
        <InputWithLabel
          w="full"
          id="email"
          label="メールアドレス"
          placeholder="mail@example.com"
          value={email}
          onChange={handleChangeEmail}
          type="email"
        />
        <InputPassword w="full" id="password" label="パスワード" value={password} onChange={handleChangePassword} />
      </VStack>

      <VStack mt="24px" pb="32px" spacing="24px" w="full">
        <HStack alignItems="start">
          <Checkbox colorScheme="brand" size="lg" onChange={handleChangeAgree} />
          <Text>
            {agreementLinks.map((link, index) => (
              <>
                {link.isExternal ? (
                  <WrappedLink key={index} color="brand.primaryText" href={link.url} isExternal>
                    {link.text}
                  </WrappedLink>
                ) : (
                  <TenantPageLink key={index} color="brand.primaryText" href={link.url} target="_blank">
                    {link.text}
                  </TenantPageLink>
                )}
                {index !== agreementLinks.length - 1 && '、'}
              </>
            ))}
            に同意します。
          </Text>
        </HStack>
        <PrimaryButton h="56px" disabled={!isValid} onClick={handleClickNext}>
          次へ
        </PrimaryButton>
      </VStack>
    </Flex>
  );
};
