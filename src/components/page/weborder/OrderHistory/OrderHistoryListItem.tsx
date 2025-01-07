import { VStack, Text, Button, HStack } from '@chakra-ui/react';

import { DateTime, OrderType } from '@/graphql/generated/types';
import { dateTimeToDate } from '@/graphql/helper';
import { formatDateToYMDHM } from '@/utils/formatUtils';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { OrderItemOptionItemsText } from '@/components/domain/OrderItemOptionItemsText';
import { myPageOrderDetail } from '@/utils/paths/tenantPages';
import { OrderItemQuantity } from '@/components/ui/OrderItemQuantity';

import { OrderHistoryListItemFragment } from './OrderHistoryListItem.fragment.generated';
import { ListItemHeader } from './ListItemHeader';

type Props = {
  order: OrderHistoryListItemFragment;
};

export const OrderHistoryListItem = ({ order }: Props) => {
  const orderType = resolveOrderType(order);
  const completionStatus =
    order.__typename === 'TakeoutOrder' || order.__typename === 'DeliveryOrder' ? order.completionStatus : null;
  return (
    <VStack as="section" align="stretch" spacing="16px">
      <VStack align="Start" spacing="8px">
        <ListItemHeader variant="history" orderType={orderType} shopName={order.facility.shortName} />
        {completionStatus && (
          <CompletionStatus status={completionStatus.statusLabel} completedAt={completionStatus.completedAt} />
        )}
      </VStack>
      <OrderItemsSummary order={order} />
      <GoDetailsButton orderId={order.id} />
    </VStack>
  );
};

const resolveOrderType = (order: OrderHistoryListItemFragment): OrderType => {
  switch (order.__typename) {
    case 'EatInOrder':
      return OrderType.EatIn;
    case 'TakeoutOrder':
      return OrderType.Takeout;
    case 'DeliveryOrder':
      return OrderType.Delivery;
  }
  throw new Error('Unsupported order type');
};

const CompletionStatus = ({ status, completedAt }: { status: string; completedAt: DateTime }) => {
  const d = dateTimeToDate(completedAt);
  return (
    <Text display="flex" flexDirection="column" textStyle="text-extra-small">
      <Text as="span">{status}</Text>
      <Text as="span">{formatDateToYMDHM(d)}</Text>
    </Text>
  );
};

const OrderItemsSummary = ({ order }: { order: OrderHistoryListItemFragment }) => {
  return (
    <VStack as="ul" align="stretch" spacing="8px">
      {order.items.map((item, index) => (
        <HStack key={index} align="start">
          <OrderItemQuantity quantity={item.quantity} />
          <VStack align="stretch" spacing="4px">
            <Text textStyle="bold-small">{item.name}</Text>
            <OrderItemOptionItemsText orderItem={item} />
          </VStack>
        </HStack>
      ))}
    </VStack>
  );
};

const GoDetailsButton = ({ orderId }: { orderId: string }) => {
  const router = useTenantRouter();
  const handleClick = () => {
    router.push(myPageOrderDetail(orderId));
  };
  return (
    <Button as="a" variant="secondary" h="40px" _hover={{ cursor: 'pointer' }} onClick={handleClick}>
      注文詳細
    </Button>
  );
};
