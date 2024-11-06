import React, { FC } from 'react';
import { Box, Image, Text, VStack, useDisclosure } from '@chakra-ui/react';

import { containerMarginX } from '@/utils/constants';
import { SecondaryButton } from '@/components/ui/Button';
import { OrderType } from '@/graphql/generated/types';
import { OrderItemsDialog } from '@/components/domain/OrderItemsDialog';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { useHomePath } from '@/hooks/domain/useHomePath';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';

import { CartMenuItemFragment } from '../CartMenuItem/CartMenuItem.fragment.generated';

import { useGetAppPromotionsQuery } from './OrderCompleted.query.generated';

type OrderCompletedMessage = {
  title: string;
  sentences: string[];
};

const orderCompletedMessages: Record<OrderType, OrderCompletedMessage> = {
  [OrderType.Delivery]: {
    title: '配達が完了しました',
    sentences: ['ご注文ありがとうございました。', 'またのご利用をお待ちしております。'],
  },
  [OrderType.EatIn]: {
    title: 'ご注文ありがとうございました',
    sentences: ['商品のお届けまでお待ちください。'],
  },
  [OrderType.Takeout]: {
    title: 'ご注文ありがとうございました',
    sentences: ['またのご利用をお待ちしております。'],
  },
};

type Props = {
  orderedItems: CartMenuItemFragment[];
  orderType: OrderType;
};

export const OrderCompleted: FC<Props> = ({ orderedItems, orderType }: Props) => {
  const home = useHomePath(orderType);
  const router = useTenantRouter();
  const [result] = useGetAppPromotionsQuery();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { error, fetching } = result;
  useLoadingOverlay(fetching);
  if (error) {
    throw error;
  }
  if (fetching) {
    return null;
  }

  const message = orderCompletedMessages[orderType];

  return (
    <>
      <OrderItemsDialog orderItems={orderedItems} isOpen={isOpen} onClose={onClose} />
      <Box mb="40px">
        <VStack align="stretch" mt="40px" mx={containerMarginX} spacing={6}>
          <VStack align="center" spacing="0px">
            <Text className="bold-large">{message.title}</Text>
            <Image src="/assets/party_popper.gif" alt="PartyPopper" boxSize="180px" />
            {message.sentences.map((sentence, index) => (
              <Text className="bold-small" align="center" key={index}>
                {sentence}
              </Text>
            ))}
          </VStack>

          <SecondaryButton h="48px" onClick={onOpen}>
            注文内容を表示する
          </SecondaryButton>
          <SecondaryButton
            h="48px"
            onClick={() => {
              router.push(home);
            }}
          >
            ホームへ戻る
          </SecondaryButton>
        </VStack>
      </Box>
    </>
  );
};
