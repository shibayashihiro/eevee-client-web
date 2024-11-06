import { HStack, Text, VStack } from '@chakra-ui/react';
import React from 'react';

import { formatPrice } from '@/utils/formatUtils';
import { useFeatureFlags } from '@/providers/FeatureFlagsProvider';
import { useGetTecAlignmentQuery } from '@/components/domain/TecAlignment/TecAlignment.query.generated';
import { OrderType } from '@/graphql/generated/types';

type Props = {
  itemName: string;
  quantity: number;
  price: number;
  orderType: OrderType;
  options?: React.ReactNode;
  actions?: React.ReactNode;
};

export const CartOrderItem = ({ actions, ...props }: Props) => {
  return (
    <VStack as="section" align="stretch" py="16px" spacing="16px">
      <ItemInfo {...props} />
      {actions && actions}
    </VStack>
  );
};

const ItemInfo = ({ quantity, itemName, price, orderType, options }: Props) => {
  const { showPriceExcludingTax } = useFeatureFlags();
  const [tecAlignmentResult] = useGetTecAlignmentQuery();
  const tecAlignment = tecAlignmentResult.data?.tenant.tecAlignment;
  return (
    <HStack alignItems="start" spacing="8px">
      <Text
        boxSizing="border-box"
        border="2px"
        minWidth="24px"
        minHeight="24px"
        borderRadius="4px"
        textAlign="center"
        fontSize="14px"
        fontWeight="700"
      >
        {quantity}
      </Text>
      <VStack flex="1" align="start" spacing="2px" mt="2px">
        <Text className="bold-small">{itemName}</Text>
        {options && options}
      </VStack>
      {/* TEC連携をしていてかつ、税抜き表示する場合、金額を表示すると細かな端数ずれが起きるため、金額を表示しない。 */}
      {/* イートイン以外は、事前決済する可能性があるため、金額を表示する} */}
      {!(showPriceExcludingTax && tecAlignment && orderType == OrderType.EatIn) && <Text className="bold-small">{formatPrice(price)}</Text>}
    </HStack>
  );
};
