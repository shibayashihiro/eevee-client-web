import React, { FC, useState } from 'react';
import { Divider, HStack, Icon, ListItem, Text, VStack } from '@chakra-ui/react';
import PlaceIcon from '@mui/icons-material/Place';

type Props = {
  itemId: string;
  fullAddress: string;
  memo?: string | null;
  onClick: () => void;
  onLeftSwipeDelete: (id: string) => void;
};

export const DeliveryAddressItem: FC<Props> = ({ itemId, fullAddress, memo, onClick, onLeftSwipeDelete }) => {
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);

  const onTouchStart = (x: number) => {
    setTouchEnd(0);
    setTouchStart(x);
  };
  const onTouchMove = (x: number) => setTouchEnd(x);
  const onTouchEnd = () => {
    if (touchStart == 0 || touchEnd == 0) return;
    if (touchStart - touchEnd <= 150) {
      return;
    }
    onLeftSwipeDelete(itemId);
  };

  return (
    <ListItem pt="16px">
      <HStack
        w="full"
        onClick={onClick}
        onTouchStart={(e) => onTouchStart(e.targetTouches[0].clientX)}
        onTouchMove={(e) => onTouchMove(e.targetTouches[0].clientX)}
        onTouchEnd={onTouchEnd}
      >
        <Icon as={PlaceIcon} />
        <VStack alignItems="start">
          <Text className="bold-small">{fullAddress}</Text>
          {memo != null && <Text className="text-extra-small">{memo}</Text>}
        </VStack>
      </HStack>
      <Divider mt="16px" />
    </ListItem>
  );
};
