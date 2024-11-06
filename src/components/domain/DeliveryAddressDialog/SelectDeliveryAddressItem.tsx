import React, { FC } from 'react';
import { Divider, HStack, Icon, ListItem, Spacer, Text, VStack } from '@chakra-ui/react';
import PlaceIcon from '@mui/icons-material/Place';
import CheckIcon from '@mui/icons-material/Check';

type Props = {
  fullAddress: string;
  memo?: string | null;
};

export const SelectDeliveryAddressItem: FC<Props> = ({ fullAddress, memo }) => {
  return (
    <ListItem pt="16px">
      <HStack w="full">
        <Icon as={PlaceIcon} color="brand.primaryText" />
        <VStack alignItems="start">
          <Text className="bold-small" color="brand.primaryText">
            {fullAddress}
          </Text>
          (memo != null &&{' '}
          <Text className="text-extra-small" color="brand.primaryText">
            {memo}
          </Text>
          )
        </VStack>
        <Spacer />
        <Icon as={CheckIcon} color="brand.primaryText" />
      </HStack>
      <Divider mt="16px" />
    </ListItem>
  );
};
