import { HStack, Icon, Divider, VStack, Text, Spinner } from '@chakra-ui/react';
import { HelpOutline } from '@mui/icons-material';
import { FC, useCallback, useMemo } from 'react';

import { WrappedLink } from '@/components/ui/WrappedLink';
import { PrimaryButton, PrimaryTextColorButton } from '@/components/ui/Button';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { signUpPage } from '@/utils/paths/tenantPages';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';

import { SignUpBenefitBanner } from '../SignUpBenefitBanner';

import { useGetAccountRegistrationIncentivesForSignUpQuery } from './LoginTop.query.generated';

type Props = {
  onClickLogin: () => void;
  backTo: string;
};

export const LoginTop: FC<Props> = ({ onClickLogin, backTo }) => {
  const router = useTenantRouter();

  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const [result] = useGetAccountRegistrationIncentivesForSignUpQuery();
  const { data, fetching, error } = result;

  if (error) {
    handleErrorWithAlertDialog(error);
  }

  const incentive = useMemo(() => {
    if (!data) {
      return null;
    }
    const { accountRegistrationIncentives } = data.tenant;
    if (accountRegistrationIncentives.length === 0) {
      return null;
    }
    return accountRegistrationIncentives[0];
  }, [data]);

  const handleClickSignUp = useCallback(() => {
    router.push(signUpPage(backTo));
  }, [router, backTo]);

  return (
    <>
      {fetching ? <Spinner className="mono-secondary" /> : incentive && <SignUpBenefitBanner fragment={incentive} />}
      <Text py="16px" w="full">
        登録は3分くらいでかんたんに完了します。すべての機能をご利用いただくために、ぜひご登録ください♪
      </Text>
      <PrimaryButton onClick={handleClickSignUp}>Chompyアカウントを新規登録する</PrimaryButton>
      <WrappedLink href="https://www.notion.so/Chompy-ec61268237b64b6e84310be72af882f2" isExternal>
        <HStack color="brand.primary">
          <Icon as={HelpOutline} boxSize="14px" />
          <Text className="bold-extra-small">Chompyってなに？</Text>
        </HStack>
      </WrappedLink>
      <Divider py="0px" />
      <VStack w="full" alignItems="start" spacing="16px">
        <Text className="bold" mt="8px">
          Chompyアカウントをお持ちですか？
        </Text>
        <Text>
          Chompyのアカウントをお持ちの場合、Chompyですでに登録している住所や支払い方法をそのまま使うことができます💡
        </Text>
      </VStack>
      <PrimaryTextColorButton onClick={onClickLogin}>Chompyアカウントでログイン</PrimaryTextColorButton>
    </>
  );
};
