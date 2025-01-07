import { Text, VStack, Heading, UnorderedList, Flex, HStack } from '@chakra-ui/react';

import { OrderItemQuantity } from '@/components/ui/OrderItemQuantity';
import { formatPrice } from '@/utils/formatUtils';

import { OrderItemOptionItemsText } from '../OrderItemOptionItemsText';

import { OrderDetailOrderItemsSummaryFragment } from './OrderItemsSummary.fragment.generated';

type Props = {
  order: OrderDetailOrderItemsSummaryFragment;
};

export const OrderItemsSummary = ({ order }: Props) => {
  return (
    <VStack align="stretch" spacing="24px">
      <OrderItemList order={order} />
      <ChargeDetails order={order} />
    </VStack>
  );
};

const OrderItemList = ({ order }: Props) => {
  return (
    <VStack align="stretch" spacing="8px">
      <Heading as="h2" fontSize="extra-small" fontWeight="bold" color="mono.secondary">
        ご注文内容
      </Heading>
      <UnorderedList listStyleType="none" m={0}>
        {order.items.map((item, index) => (
          <Flex
            as="li"
            key={index}
            align="start"
            py="16px"
            borderTop="1px"
            borderTopColor="mono.divider"
            _last={{
              borderBottom: '1px',
              borderBottomColor: 'mono.divider',
            }}
            gap="8px"
          >
            <OrderItemQuantity quantity={item.quantity} />
            <VStack flex={1} align="stretch" spacing="4px">
              <Text textStyle="bold-small">{item.name}</Text>
              <OrderItemOptionItemsText orderItem={item} />
            </VStack>
            <Text textStyle="bold-small">{formatPrice(item.totalPrice)}</Text>
          </Flex>
        ))}
      </UnorderedList>
    </VStack>
  );
};

const ChargeDetails = ({ order: { charge } }: Props) => {
  return (
    <VStack as="dl" align="stretch" spacing="8px">
      {charge.details.map((detail, index) => (
        <HStack key={index} justify="space-between">
          <Text as="dt" textStyle="text-extra-small">
            {detail.name}
          </Text>
          <Text as="dd" textStyle="text-extra-small">
            {formatPrice(detail.amount)}
          </Text>
        </HStack>
      ))}
      <HStack justify="space-between">
        <Text as="dt" textStyle="bold-normal">
          合計
        </Text>
        <Text as="dd" textStyle="bold-normal">
          {formatPrice(charge.amount)}
        </Text>
      </HStack>
    </VStack>
  );
};
