import React, { FC, useCallback, useState } from 'react';
import { Box, VStack, Text, OrderedList, Divider, useDisclosure } from '@chakra-ui/react';

import { AddressRegistrationOptions } from '@/components/domain/AddressRegistrationOptions';
import { SelectDeliveryAddressItem } from '@/components/domain/DeliveryAddressDialog/SelectDeliveryAddressItem';
import { UnSelectDeliveryAddressItem } from '@/components/domain/DeliveryAddressDialog/UnSelectDeliveryAddressItem';
import { useUpdateUsingDeliveryAddressMutation } from '@/components/domain/DeliveryAddressDialog/DeliveryAddressDialog.mutation.generated';
import { generateMutationId } from '@/graphql/helper';
import { DeliveryAddressDeleteDialog } from '@/components/domain/DeliveryAddressDialog/DeliveryAddressDeleteDialog';
import { DeliveryAddressDialogPartsFragment } from '@/components/domain/DeliveryAddressDialog/DeliveryAddressDialog.fragment.generated';
import { ModalDialog } from '@/components/ui/ModalDialog';
import { toFullAddress } from '@/utils/formatUtils';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  fragment: DeliveryAddressDialogPartsFragment[];
};

export const useDeliveryAddressDeleteDialogState = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpen = useCallback(
    (id: string) => {
      setSelectedId(id);
      onOpen();
    },
    [onOpen],
  );

  return {
    selectedId,
    isOpen,
    onOpen: handleOpen,
    onClose,
  };
};

export const DeliveryAddressDialog: FC<Props> = ({ isOpen, onClose, fragment }) => {
  const deleteDialogState = useDeliveryAddressDeleteDialogState();
  const [result, updateUsing] = useUpdateUsingDeliveryAddressMutation();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const handleOnClick = async (id: string) => {
    const result = await updateUsing({
      input: {
        clientMutationId: generateMutationId(),
        deliveryAddressId: id,
      },
    });
    if (result.error) {
      await handleErrorWithAlertDialog(result.error);
    }
    onClose();
  };

  const { fetching, error } = result;
  useLoadingOverlay(fetching);
  if (error) {
    throw error;
  }
  return (
    <>
      <DeliveryAddressDeleteDialog
        isOpen={deleteDialogState.isOpen}
        onClose={deleteDialogState.onClose}
        itemId={deleteDialogState.selectedId}
      />
      <ModalDialog
        isOpen={isOpen}
        onClose={onClose}
        title="お届け先を登録してください"
        secondaryAction={{
          text: '閉じる',
          onClick: onClose,
        }}
      >
        <VStack align="start">
          <AddressRegistrationOptions />
          {fragment.length > 0 && (
            <>
              <Box pt="24px" w="full">
                <Text className="bold-medium">登録済みのお届け先</Text>
                <Divider mt="16px" />
                <OrderedList styleType="none" marginStart="0px">
                  {fragment.map((item, i) => (
                    <React.Fragment key={i}>
                      {item.isUsing && (
                        <SelectDeliveryAddressItem
                          fullAddress={toFullAddress(item.prefecture, item.addressLine, item.buildingName, '')}
                          memo={item.memo}
                        />
                      )}
                      {!item.isUsing && (
                        <UnSelectDeliveryAddressItem
                          itemId={item.id}
                          fullAddress={toFullAddress(item.prefecture, item.addressLine, item.buildingName, '')}
                          memo={item.memo}
                          onClick={() => handleOnClick(item.id)}
                          onLeftSwipeDelete={deleteDialogState.onOpen}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </OrderedList>
              </Box>
            </>
          )}
        </VStack>
      </ModalDialog>
    </>
  );
};
