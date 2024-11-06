import { Icon, HStack, Text } from '@chakra-ui/react';
import React from 'react';
import WorkIcon from '@mui/icons-material/Work';

import { OrderType } from '@/graphql/generated/types';

import { SelectOrderTypeSectionPartsFragment } from './SelectOrderTypeSection.fragment.generated';

type Props = {
  fragment: SelectOrderTypeSectionPartsFragment;
  initialOrderType: OrderType;
};

const tabName = (orderType: OrderType) => {
  switch (orderType) {
    case OrderType.EatIn:
      return 'イートイン';
    case OrderType.Takeout:
      return 'テイクアウト';
    case OrderType.Delivery:
      return 'デリバリー';
  }
};

export const SelectOrderTypeSection = (props: Props) => {
  // タブを切り替えられると不都合が生じるため、タブを表示せず、選択した注文タイプを表示する
  return <CurrentOrderTypeText orderType={props.initialOrderType} />;
};


const CurrentOrderTypeText = ({ orderType }: { orderType: OrderType }) => {
  return (
    <HStack w="full" alignItems="center" mt="40px">
      {orderType == OrderType.Takeout && <Icon as={WorkIcon} boxSize="20px" />}
      <Text className="bold-large">{tabName(orderType)}注文</Text>
    </HStack>
  );
};
