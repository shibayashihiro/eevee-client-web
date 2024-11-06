import React, { FC } from 'react';
import { Box, Divider, Text, VStack } from '@chakra-ui/react';

import { ModalDialog } from '@/components/ui/ModalDialog';
import { DeliveryAddressCreateButton } from '@/components/domain/DeliveryAddressCreateButton';
import { PrimaryButton } from '@/components/ui/Button';
import { useResolvedHomePath, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { loginPage } from '@/utils/paths/tenantPages';
import { useAuthUser } from '@/auth/provider/AuthUserProvider';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const DeliveryAddressRegistrationDialog: FC<Props> = ({ isOpen, onClose }: Props) => {
  const { isAnonymous } = useAuthUser();
  const router = useTenantRouter();
  const home = useResolvedHomePath();

  const handleOnClick = async () => {
    await router.replace(loginPage(home));
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title="お届け先を登録してください"
      linkAction={{
        text: '閉じる',
        onClick: onClose,
      }}
    >
      <VStack align="start">
        <DeliveryAddressCreateButton />
        {isAnonymous && (
          <>
            <Box pt="24px">
              <Divider color="mono.divider" />
              <Text className="bold" mt="24px" mb="16px">
                デリバリーのご注文について
              </Text>
              <Text mb="16px">デリバリーのご注文のためにはChompyアカウントのご登録が必要です。</Text>
            </Box>
            <PrimaryButton onClick={handleOnClick}>ログインまたは新規登録</PrimaryButton>
          </>
        )}
      </VStack>
    </ModalDialog>
  );
};
