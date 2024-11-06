import React, { FC } from 'react';
import { Button, HStack, Icon, Text, useDisclosure, VStack } from '@chakra-ui/react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PinDropIcon from '@mui/icons-material/PinDrop';

import variables from '@/styles/variables.module.scss';
import { DeliveryAddressIndicatorPartsFragment } from '@/components/domain/DeliveryAddressIndicator/DeliveryAddressIndicator.fragment.generated';
import { DeliveryAddressDialog } from '@/components/domain/DeliveryAddressDialog';

type Props = {
  fragment?: DeliveryAddressIndicatorPartsFragment[];
};

export const DeliveryAddressIndicator: FC<Props> = ({ fragment }: Props) => {
  const deliveryAddressDialogState = useDisclosure();

  if (!fragment) {
    return null;
  }
  const using = fragment.find((f) => f.isUsing);
  const addressText =
    using != null ? `${using.prefecture} ${using.addressLine} ${using.buildingName}` : 'お届け先を登録する';

  return (
    <>
      <DeliveryAddressDialog
        isOpen={deliveryAddressDialogState.isOpen}
        onClose={deliveryAddressDialogState.onClose}
        fragment={fragment}
      />
      <Button
        as="a"
        variant="outline"
        rounded="12px"
        h="76px"
        p="18px"
        w="full"
        left="auto"
        onClick={deliveryAddressDialogState.onOpen}
      >
        <HStack align="center" justify="space-between" w="full">
          <VStack align="trailing" isTruncated>
            <Text className="bold-extra-small" color={variables.monoSecondary}>
              お届け先
            </Text>
            <HStack spacing="10px">
              <Icon as={PinDropIcon} boxSize="24px" />
              <Text className="bold-small">{addressText}</Text>
            </HStack>
          </VStack>
        </HStack>
        <HStack spacing="5px">
          <Icon as={KeyboardArrowDownIcon} boxSize="24px" />
        </HStack>
      </Button>
    </>
  );
};
