import React, { FC } from 'react';
import { Text } from '@chakra-ui/react';

import { ModalDialog } from '@/components/ui/ModalDialog';
import { useRemoveDeliveryAddressMutation } from '@/components/domain/DeliveryAddressDialog/DeliveryAddressDialog.mutation.generated';
import { generateMutationId } from '@/graphql/helper';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  itemId: string | null;
};

export const DeliveryAddressDeleteDialog: FC<Props> = ({ isOpen, onClose, itemId }: Props) => {
  const [result, removeDeliveryAddress] = useRemoveDeliveryAddressMutation();

  const handleSubmit = async () => {
    if (!itemId) return;

    // TODO(anyone): 最後の1つの場合はアプリと同様に削除できないようバリデーションすべきかもしれない
    await removeDeliveryAddress({
      input: {
        clientMutationId: generateMutationId(),
        deliveryAddressId: itemId,
      },
    });
    onClose();
  };

  const { fetching, error } = result;
  useLoadingOverlay(fetching);
  if (error) {
    throw error;
  }

  return (
    <>
      <ModalDialog
        title="登録済みのお届け先を削除"
        isOpen={isOpen}
        onClose={onClose}
        secondaryAction={{
          text: 'キャンセル',
          onClick: onClose,
        }}
        primaryAction={{
          text: 'OK',
          onClick: handleSubmit,
        }}
        closeOnOverlayClick={false}
      >
        <Text>このお届け先を削除してもよろしいですか？</Text>
      </ModalDialog>
    </>
  );
};
