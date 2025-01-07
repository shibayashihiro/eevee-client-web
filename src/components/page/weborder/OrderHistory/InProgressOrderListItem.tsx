import { VStack, Text, SimpleGrid, Button } from '@chakra-ui/react';

import { OrderType } from '@/graphql/generated/types';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { myPageOrderDetail } from '@/utils/paths/tenantPages';

import { InProgressOrderListItemFragment } from './InProgressOrderListItem.fragment.generated';
import { ListItemHeader } from './ListItemHeader';

type Props = {
  order: InProgressOrderListItemFragment;
};

export const InProgressOrderListItem = ({ order }: Props) => {
  const orderType = resolveOrderType(order);
  return (
    <VStack as="section" align="stretch" spacing="16px">
      <ListItemHeader variant="inProgress" orderType={orderType} shopName={order.facility.shortName} />
      {order.progress && (
        <PickupInfo scheduledTime={order.progress?.scheduledTime} shortId={order.shortIds.join(', ')} />
      )}
      <GoDetailsButton orderId={order.id} />
    </VStack>
  );
};

const resolveOrderType = (order: InProgressOrderListItemFragment): OrderType => {
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

const PickupInfo = ({ scheduledTime, shortId }: { scheduledTime: string; shortId: string }) => {
  return (
    <SimpleGrid columns={2}>
      <PickupInfoItem title="受け取り時間" value={scheduledTime} />
      <PickupInfoItem title="受け取り番号" value={shortId} />
    </SimpleGrid>
  );
};

const PickupInfoItem = ({ title, value }: { title: string; value: string }) => {
  return (
    <VStack align="start" spacing="4px">
      <Text textStyle="bold-extra-small" color="mono.secondary">
        {title}
      </Text>
      <Text fontSize="24px" fontWeight="700" lineHeight="30px" letterSpacing="-0.24px">
        {value}
      </Text>
    </VStack>
  );
};

const GoDetailsButton = ({ orderId }: { orderId: string }) => {
  const router = useTenantRouter();
  const handleClick = () => {
    router.push(myPageOrderDetail(orderId));
  };
  return (
    <Button as="a" variant="primary" h="40px" _hover={{ cursor: 'pointer' }} onClick={handleClick}>
      注文状況を確認する
    </Button>
  );
};
