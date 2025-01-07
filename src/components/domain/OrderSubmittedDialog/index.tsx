import { FC } from 'react';
import { Text, VStack, Stack } from '@chakra-ui/react';

import { OrderType } from '@/graphql/generated/types';
import { ModalDialog } from '@/components/ui/ModalDialog';

const descriptions: Record<OrderType, string> = {
  [OrderType.Delivery]: '商品のお届けまでおまちください。',
  [OrderType.Takeout]: '商品の準備が終わるまでおまちください。',
  [OrderType.EatIn]: '',
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  orderType: OrderType;
};

export const OrderSubmittedDialog: FC<Props> = ({ isOpen, onClose, orderType }: Props) => {
  return (
    <ModalDialog
      title="注文が完了しました"
      isOpen={isOpen}
      onClose={onClose}
      primaryAction={{
        text: '閉じる',
        onClick: onClose,
        height: '56px',
      }}
    >
      <VStack alignItems="start">
        <Stack spacing={0}>
          <Text className="text-medium">ご注文ありがとうございます。</Text>
          <Text className="text-medium">{descriptions[orderType]}</Text>
        </Stack>
      </VStack>
    </ModalDialog>
  );
};
