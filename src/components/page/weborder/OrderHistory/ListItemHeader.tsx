import { VStack, Heading, Text } from '@chakra-ui/react';

import { OrderType } from '@/graphql/generated/types';
import { DeliveryIcon } from '@/components/ui/Icons/DeliveryIcon';
import { EatInIcon } from '@/components/ui/Icons/EatInIcon';
import { TakeoutIcon } from '@/components/ui/Icons/TakeoutIcon';

type Props = {
  orderType: OrderType;
  shopName: string;
  variant: Variant;
};

type Variant = 'inProgress' | 'history';

type Styles = {
  iconBoxSize: string;
  orderTypeTextStyle: string;
  shopNameTextStyle: string;
};

const variantStyles: Record<Variant, Styles> = {
  inProgress: {
    iconBoxSize: '20px',
    orderTypeTextStyle: 'bold-large',
    shopNameTextStyle: 'bold-small',
  },
  history: {
    iconBoxSize: '16px',
    orderTypeTextStyle: 'bold-normal',
    shopNameTextStyle: 'bold-extra-small',
  },
};

export const ListItemHeader = ({ orderType, shopName, variant }: Props) => {
  const styles = variantStyles[variant];
  return (
    <VStack as="header" align="stretch" spacing="4px">
      <Heading as="h3">
        <OrderTypeIcon orderType={orderType} boxSize={styles.iconBoxSize} />
        <Text as="span" textStyle={styles.orderTypeTextStyle} ml="4px">
          {orderTypeText[orderType]}
        </Text>
      </Heading>
      <Text textStyle={styles.shopNameTextStyle}>{shopName}</Text>
    </VStack>
  );
};

const OrderTypeIcon = ({ orderType, boxSize }: { orderType: OrderType; boxSize: string }) => {
  switch (orderType) {
    case OrderType.EatIn:
      return <EatInIcon boxSize={boxSize} aria-hidden="true" />;
    case OrderType.Takeout:
      return <TakeoutIcon boxSize={boxSize} aria-hidden="true" />;
    case OrderType.Delivery:
      return <DeliveryIcon boxSize={boxSize} aria-hidden="true" />;
  }
  return null;
};

const orderTypeText: Record<OrderType, string> = {
  [OrderType.EatIn]: 'イートイン',
  [OrderType.Takeout]: 'テイクアウト',
  [OrderType.Delivery]: 'デリバリー',
};
