import React, { useCallback, useState } from 'react';
import { Box, Divider, VStack, Text, useDisclosure } from '@chakra-ui/react';

import { NextPageWithLayout } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { AddressRegistrationOptions } from '@/components/domain/AddressRegistrationOptions';
import { DeliveryAddressList } from '@/components/domain/DeliveryAddressList';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { deliveryAddressSelectPage, loginPage, signUpPage } from '@/utils/paths/tenantPages';
import { PrimaryButton, PrimaryTextColorButton } from '@/components/ui/Button';
import { useAuthUser } from '@/auth/provider/AuthUserProvider';
import { useUpdateUsingDeliveryAddressMutation } from '@/components/domain/DeliveryAddressDialog/DeliveryAddressDialog.mutation.generated';
import { generateMutationId } from '@/graphql/helper';
import variables from '@/styles/variables.module.scss';
import { NavigationHeaderLayout } from '@/components/layouts/NavigationHeaderLayout';
import { containerMarginX } from '@/utils/constants';
import { deliveryHome } from '@/utils/paths/facilityPages';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';

import { useGetDeliveryAddressSelectQuery } from './DeliveryAddressSelect.query.generated';

const useDeliveryAddressDeleteDialogState = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { onOpen, onClose } = useDisclosure();

  const handleOpen = useCallback(
    (id: string) => {
      setSelectedId(id);
      onOpen();
    },
    [onOpen],
  );

  return {
    selectedId,
    onOpen: handleOpen,
    onClose,
  };
};

const DeliveryAddressSelectPage: NextPageWithLayout = () => {
  const router = useTenantRouter();
  const [{ data, error, fetching }] = useGetDeliveryAddressSelectQuery();
  const deleteDialogState = useDeliveryAddressDeleteDialogState();
  const [_, updateUsing] = useUpdateUsingDeliveryAddressMutation();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();
  const { isAnonymous } = useAuthUser();

  if (fetching) {
    return <LoadingSpinner />;
  }
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error('データが見つかりませんでした。');
  }

  const deliveryAddresses = data.viewer.deliveryAddresses;
  const idProviderName = data.viewing.idProviderName;
  const backTo = deliveryAddressSelectPage;
  const hasAddresses = deliveryAddresses.length > 0;

  const handleOnClick = async (id: string) => {
    const mutationResult = await updateUsing({
      input: {
        clientMutationId: generateMutationId(),
        deliveryAddressId: id,
      },
    });
    if (mutationResult.error) {
      handleErrorWithAlertDialog(mutationResult.error);
      return;
    }

    const newFacilityId = mutationResult.data?.updateUsingDeliveryAddress.assignedFacilityId;

    if (newFacilityId) {
      router.push(deliveryHome(newFacilityId));
    }
  };

  return (
    <NavigationHeaderLayout viewing={data.viewing} viewer={data.viewer} facility={null}>
      <Box as="main" px={containerMarginX} py="24px">
        <VStack mx="auto" spacing="24px" maxW={variables.containerMaxWidth} align="stretch">
          {isAnonymous && (
            <VStack align="stretch" spacing={0}>
              <Text className="bold-large">注文をするには会員登録またはログインが必要です</Text>
              <VStack align="stretch" spacing="16px" mb="20px">
                <GoToSignUpButton idProviderName={idProviderName} backTo={backTo} />
                <GoToLoginButton backTo={backTo} />
              </VStack>
              <Divider my="24px" color="mono.divider" />
            </VStack>
          )}
        </VStack>
        <VStack mx="auto" spacing="16px" maxW={variables.containerMaxWidth} align="start">
          <Text className="bold-large">お届け先を登録してください</Text>
          <AddressRegistrationOptions />
          {hasAddresses && (
            <>
              <Divider py="0px" />
              <DeliveryAddressList
                fragment={deliveryAddresses}
                deleteDialogState={deleteDialogState}
                handleOnClick={handleOnClick}
              />
            </>
          )}
        </VStack>
      </Box>
    </NavigationHeaderLayout>
  );
};

const GoToSignUpButton = ({ idProviderName, backTo }: { idProviderName: string; backTo: string }) => {
  const router = useTenantRouter();

  const handleClick = useCallback(() => {
    router.push(signUpPage(backTo));
  }, [router, backTo]);

  return (
    <PrimaryButton display="flex" flexDirection="column" minH="56px" onClick={handleClick} mt="16px">
      <Text as="span" textStyle="bold-small">
        新規会員登録する
      </Text>
      <Text as="span" textStyle="text-extra-small">{`${idProviderName}登録`}</Text>
    </PrimaryButton>
  );
};

const GoToLoginButton = ({ backTo }: { backTo: string }) => {
  const router = useTenantRouter();

  const handleClick = useCallback(() => {
    router.push(loginPage(backTo));
  }, [router, backTo]);

  return (
    <PrimaryTextColorButton minH="44px" onClick={handleClick}>
      ログイン
    </PrimaryTextColorButton>
  );
};

export default DeliveryAddressSelectPage;
