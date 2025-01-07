import React, { FC, useCallback } from 'react';
import { VStack } from '@chakra-ui/react';

import { ModalDialog } from '@/components/ui/ModalDialog';
import { PrimaryButton, PrimaryTextColorButton } from '@/components/ui/Button';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { loginPage, signUpPage } from '@/utils/paths/tenantPages';
import { useAuthUser } from '@/auth/provider/AuthUserProvider';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

import { useGetSignInRequiredDialogQuery } from './SignInRequiredDialog.generated';

type Props = {
  title: string;
  backTo: string;
  isOpen: boolean;
  onClose: () => void;
};

export const SignInRequiredDialog: FC<Props> = ({ title, backTo, isOpen, onClose }: Props) => {
  const { isAnonymous } = useAuthUser();

  const [{ data, fetching, error }] = useGetSignInRequiredDialogQuery({
    pause: !isAnonymous,
  });

  if (!isAnonymous) {
    return null;
  }
  if (fetching) {
    return <LoadingSpinner />;
  }
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error('データが見つかりませんでした。');
  }

  const idProviderName = data.viewing.idProviderName;
  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      secondaryAction={{
        text: '閉じる',
        onClick: onClose,
      }}
    >
      <VStack align="start" gap="0px">
        <GoToSignUpButton idProviderName={idProviderName} backTo={backTo} />
        <GoToLoginButton backTo={backTo} />
      </VStack>
    </ModalDialog>
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

const GoToLoginButton = ({ backTo }: { backTo: string }) => {
  const router = useTenantRouter();

  const handleClick = useCallback(() => {
    router.push(loginPage(backTo));
  }, [router, backTo]);

  return (
    <PrimaryTextColorButton minH="56px" onClick={handleClick} mt="16px">
      ログイン
    </PrimaryTextColorButton>
  );
};
