import { Heading, Text } from '@chakra-ui/react';

import { TakeoutIcon } from '@/components/ui/Icons/TakeoutIcon';
import { OrderType } from '@/graphql/generated/types';
import { DeliveryIcon } from '@/components/ui/Icons/DeliveryIcon';
import { EatInIcon } from '@/components/ui/Icons/EatInIcon';

type Props = {
  orderType: OrderType;
  shopName: string;
};

export const OrderTypeShopHeader = ({ orderType, shopName }: Props) => {
  const meta = orderTypeMeta[orderType];
  return (
    <Heading as="h2" display="flex" alignItems="center">
      {meta.icon}
      <Text as="span" textStyle="bold-normal" ml="4px" color="mono.primary">
        {shopName}
      </Text>
    </Heading>
  );
};

type OrderTypeMeta = {
  title: string;
  icon: React.ReactNode;
};

const orderTypeMeta: Record<OrderType, OrderTypeMeta> = {
  [OrderType.EatIn]: {
    title: 'イートイン',
    icon: <EatInIcon boxSize="20px" aria-hidden="true" color="mono.primary" />,
  },
  [OrderType.Takeout]: {
    title: 'お持ち帰り',
    icon: <TakeoutIcon boxSize="20px" aria-hidden="true" color="brand.primary" />,
  },
  [OrderType.Delivery]: {
    title: '宅配・デリバリー',
    icon: <DeliveryIcon boxSize="20px" aria-hidden="true" color="brand.primary" />,
  },
};
