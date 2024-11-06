import React, { FC } from 'react';
import { Text } from '@chakra-ui/react';

import { useRemovePaymentMutation } from '@/components/domain/PaymentDialog/PaymentDialog.mutation.generated';
import { generateMutationId } from '@/graphql/helper';
import { ModalDialog } from '@/components/ui/ModalDialog';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  itemId: string | null;
};

export const PaymentDeleteDialog: FC<Props> = ({ isOpen, onClose, itemId }: Props) => {
  const [removePaymentResult, removePayment] = useRemovePaymentMutation();

  const handleSubmit = async () => {
    if (!itemId) return;

    await removePayment({
      input: {
        clientMutationId: generateMutationId(),
        paymentId: itemId,
      },
    });
    onClose();
  };

  const { fetching, error } = removePaymentResult;
  useLoadingOverlay(fetching);
  if (error) {
    throw error;
  }
  return (
    <>
      <ModalDialog
        title="クレジットカードを削除"
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
        <Text>このクレジットカード情報を削除してもよろしいですか？</Text>
      </ModalDialog>
    </>
  );
};
