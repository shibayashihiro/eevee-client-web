import { FC } from 'react';
import { Badge, Text } from '@chakra-ui/react';

import { OrderType } from '@/graphql/generated/types';

import { AvailableOrderTypeBadgePartsFragment } from './AvailableOrderTypeBadge.fragment.generated';

export * from './AvailableOrderTypeBadge.fragment.generated';

type Props = { availableOrderType: AvailableOrderTypeBadgePartsFragment };

const orderTypeLabels: Record<OrderType, string> = {
  [OrderType.Delivery]: 'デリバリー',
  [OrderType.Takeout]: 'テイクアウト',
  [OrderType.EatIn]: 'イートイン',
};

export const AvailableOrderTypeBadge: FC<Props> = ({ availableOrderType }) => {
  return (
    <Badge bg="mono.secondary" px="4px" py="1px" rounded="4px" whiteSpace="normal">
      <Text color="mono.white" className="bold-micro">
        {orderTypeLabels[availableOrderType.orderType]}&nbsp;{availableOrderType.label}
      </Text>
    </Badge>
  );
};
