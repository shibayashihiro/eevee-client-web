import React, { FC } from 'react';
import { FormControl, Text, Textarea } from '@chakra-ui/react';

import { useUpdateDeliveryAddressMemoMutation } from '@/components/domain/DeliveryAddressMemoInputDialog/DeliveryAddressMemoInputDialog.mutation.generated';
import { generateMutationId } from '@/graphql/helper';
import { ModalDialog } from '@/components/ui/ModalDialog';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';

type Props = {
  deliveryAddressId: string;
  initialValue: string;
  isOpen: boolean;
  onClose: () => void;
};

export const DeliveryAddressMemoInputDialog: FC<Props> = ({ deliveryAddressId, initialValue, isOpen, onClose }) => {
  const [memo, setMemo] = React.useState(initialValue);
  const [result, updateMemo] = useUpdateDeliveryAddressMemoMutation();

  const handleChangeMemo = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMemo(e.target.value);
  };

  const handleSubmit = async () => {
    const { error } = await updateMemo({
      input: {
        clientMutationId: generateMutationId(),
        deliveryAddressId,
        memo,
      },
    });

    if (error) {
      throw error;
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
      <ModalDialog
        title={'配達時の注意点メモ'}
        isOpen={isOpen}
        onClose={onClose}
        secondaryAction={{
          text: 'キャンセル',
          onClick: onClose,
        }}
        primaryAction={{
          text: '登録する',
          onClick: handleSubmit,
        }}
        closeOnOverlayClick={false}
        trapFocus={false}
      >
        <FormControl>
          <Textarea
            className="bold-small"
            minHeight="124px"
            pt="8px"
            backgroundColor="mono.bg"
            borderRadius="4px"
            id="delivery-address-memo"
            placeholder="緑色の外壁のマンションです。入り口は大通り側にあります。玄関前に置き配でお願いします"
            onChange={handleChangeMemo}
            value={memo}
          />
        </FormControl>
        <Text className="text-extra-small" color="maroon.secondary" pt="8px">
          ※配達時間の指定のご要望にはお応えできかねます。
        </Text>
      </ModalDialog>
    </>
  );
};
