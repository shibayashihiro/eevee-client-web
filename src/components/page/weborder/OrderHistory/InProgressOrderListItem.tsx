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
        <ReceiveInfo
          scheduledTime={order.progress?.scheduledTime}
          shortId={order.shortIds.join(', ')}
          orderType={orderType}
        />
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

const ReceiveInfo = ({
  scheduledTime,
  shortId,
  orderType,
}: {
  scheduledTime: string;
  shortId: string;
  orderType: OrderType;
}) => {
  const scheduledTimeTitle = orderType === OrderType.Delivery ? 'お届け時間' : '受け取り時間';
  const shortIdTitle = orderType === OrderType.Delivery ? 'お届け番号' : '受け取り番号';
  return (
    <SimpleGrid columns={2}>
      <ReceiveInfoItem title={scheduledTimeTitle} value={scheduledTime} />
      <ReceiveInfoItem title={shortIdTitle} value={shortId} />
    </SimpleGrid>
  );
};

const ReceiveInfoItem = ({ title, value }: { title: string; value: string }) => {
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
