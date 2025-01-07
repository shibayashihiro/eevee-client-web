import { Heading, VStack, Text } from '@chakra-ui/react';

import { EatInIcon } from '@/components/ui/Icons/EatInIcon';
import { TakeoutIcon } from '@/components/ui/Icons/TakeoutIcon';
import { DeliveryIcon } from '@/components/ui/Icons/DeliveryIcon';
import { dateTimeToDate } from '@/graphql/helper';
import { formatDateToYMDHM } from '@/utils/formatUtils';
import { DateTime } from '@/graphql/generated/types';

import { OrderDetailCompletedOrderStatusViewFragment } from './CompletedOrderStatusView.fragment.generated';

type Props = {
  order: OrderDetailCompletedOrderStatusViewFragment;
};

export const CompletedOrderStatusView = ({ order }: Props) => {
  const completionStatus =
    order.__typename === 'TakeoutOrder' || order.__typename === 'DeliveryOrder' ? order.completionStatus : null;
  return (
    <VStack align="start" spacing="15px">
      <OrderInfo order={order} />
      {completionStatus && (
        <CompletionStatus status={completionStatus.statusLabel} completedAt={completionStatus.completedAt} />
      )}
    </VStack>
  );
};

const OrderInfo = ({ order }: Props) => {
  return (
    <VStack align="start" spacing="5px">
      <Heading as="h3">
        <OrderTypeIcon order={order} />
        <Text as="span" textStyle="bold-large" ml="4px">
          {orderTypeText(order)}
        </Text>
      </Heading>
      <Text textStyle="bold-small">{order.facility.shortName}</Text>
    </VStack>
  );
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

const OrderTypeIcon = ({ order }: Props) => {
  const boxSize = '20px';
  switch (order.__typename) {
    case 'EatInOrder':
      return <EatInIcon boxSize={boxSize} aria-hidden="true" />;
    case 'TakeoutOrder':
      return <TakeoutIcon boxSize={boxSize} aria-hidden="true" />;
    case 'DeliveryOrder':
      return <DeliveryIcon boxSize={boxSize} aria-hidden="true" />;
  }
  return null;
};

const orderTypeText = (order: OrderDetailCompletedOrderStatusViewFragment) => {
  switch (order.__typename) {
    case 'EatInOrder':
      return 'イートイン';
    case 'TakeoutOrder':
      return 'テイクアウト';
    case 'DeliveryOrder':
      return 'デリバリー';
  }
  return '';
};
