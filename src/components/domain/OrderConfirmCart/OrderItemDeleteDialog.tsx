import React, { FC, useCallback, useState } from 'react';
import { Text, useDisclosure } from '@chakra-ui/react';

import { ModalDialog } from '@/components/ui/ModalDialog';
import { generateMutationId } from '@/graphql/helper';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';

import { useRemoveOrderItemMutation } from './OrderItemDeleteDialog.mutation.generated';

type Props = {
  cartId: string;
  itemId: string | null;
  isOpen: boolean;
  onClose: () => void;
};

export const useItemDeleteDialog = () => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpen = useCallback(
    (itemId: string) => {
      setSelectedItemId(itemId);
      onOpen();
    },
    [onOpen],
  );

  return {
    selectedItemId,
    isOpen,
    onOpen: handleOpen,
    onClose,
  };
};

export const OrderItemDeleteDialog: FC<Props> = ({ cartId, itemId, isOpen, onClose }) => {
  const [{ fetching }, removeOrderItem] = useRemoveOrderItemMutation();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();
  const handleSubmit = async () => {
    if (!itemId) {
      return;
    }
    const { error } = await removeOrderItem({
      input: {
        clientMutationId: generateMutationId(),
        cartId,
        orderItemId: itemId,
      },
    });
    if (error) {
      handleErrorWithAlertDialog(error);
    }
    onClose();
  };

  return (
    <>
      <ModalDialog
        title={'カートから削除'}
        isOpen={isOpen}
        onClose={onClose}
        secondaryAction={{
          text: 'キャンセル',
          onClick: onClose,
          isLoading: fetching,
        }}
        primaryAction={{
          text: 'OK',
          onClick: handleSubmit,
          isLoading: fetching,
        }}
        closeOnOverlayClick={false}
      >
        <Text>この商品をカートから削除してもよろしいですか？</Text>
      </ModalDialog>
    </>
  );
};
