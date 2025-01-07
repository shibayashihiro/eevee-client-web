import React from 'react';
import { Box, Divider, OrderedList, Text } from '@chakra-ui/react';

import { toFullAddress } from '@/utils/formatUtils';

import { DeliveryAddressItem } from '../DeliveryAddressItem';

import { DeliveryAddressListPartsFragment } from './DeliveryAddressList.fragment.generated';

type DeleteDialogState = {
  selectedId: string | null;
  onOpen: (id: string) => void;
  onClose: () => void;
};

type DeliveryAddressListProps = {
  fragment: DeliveryAddressListPartsFragment[];
  deleteDialogState: DeleteDialogState;
  handleOnClick: (id: string) => Promise<void>;
};

export const DeliveryAddressList: React.FC<DeliveryAddressListProps> = ({
  fragment,
  deleteDialogState,
  handleOnClick,
}) => (
  <Box pt="24px" w="full">
    <Text className="bold-large">登録済みのお届け先</Text>
    <Divider mt="16px" />
    <OrderedList styleType="none" marginStart="0px">
      {fragment.map((item, i) => (
        <React.Fragment key={i}>
          <DeliveryAddressItem
            itemId={item.id}
            fullAddress={toFullAddress(item.prefecture, item.addressLine, item.buildingName, '')}
            memo={item.memo}
            onClick={() => handleOnClick(item.id)}
            onLeftSwipeDelete={deleteDialogState.onOpen}
          />
        </React.Fragment>
      ))}
    </OrderedList>
  </Box>
);
