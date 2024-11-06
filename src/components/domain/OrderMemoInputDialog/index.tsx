import React, { FC } from 'react';
import { FormControl, Text, Textarea } from '@chakra-ui/react';

import { ModalDialog } from '@/components/ui/ModalDialog';
import { generateMutationId } from '@/graphql/helper';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';

import { useUpdateMemoMutation } from './OrderMemoInputDialog.mutation.generated';

type MemoPlaceholder = {
  [key: string]: string;
};

const placeholderByTenantUid: MemoPlaceholder = {
  wQwAvAIqkUt6vfoWKv4C: '胡椒抜きでお願いします。', // いきなりステーキ
} as const;

type Props = {
  cartId: string;
  tenantUid: string;
  initialValue: string;
  isOpen: boolean;
  onClose: () => void;
};

export const OrderMemoInputDialog: FC<Props> = ({ cartId, tenantUid, initialValue, isOpen, onClose }) => {
  const [memo, setMemo] = React.useState(initialValue);
  const [result, updateMemo] = useUpdateMemoMutation();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const handleChangeOrderMemo = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMemo(e.target.value);
  };

  const handleSubmit = async () => {
    const { error } = await updateMemo({
      input: {
        clientMutationId: generateMutationId(),
        cartId,
        memo,
      },
    });
    if (error) {
      handleErrorWithAlertDialog(error);
      return;
    }
    onClose();
  };

  const { fetching, error } = result;
  useLoadingOverlay(fetching);
  if (error) {
    throw error;
  }

  return (
    <ModalDialog
      title={'お店へのお願いメモ'}
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
          id="order-memo"
          placeholder={
            placeholderByTenantUid[tenantUid] ?? 'ドレッシングは別添え希望です。パクチーは入れないでください。'
          }
          onChange={handleChangeOrderMemo}
          value={memo}
        />
      </FormControl>
      <Text className="text-extra-small" color="maroon.secondary" pt="8px">
        ※ご要望の内容によっては希望に添えない場合がございます。あらかじめご了承ください。
      </Text>
    </ModalDialog>
  );
};
