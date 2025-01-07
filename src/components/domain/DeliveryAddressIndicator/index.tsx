import React, { FC } from 'react';
import { HStack, Icon, Text, useDisclosure, VStack } from '@chakra-ui/react';
import PinDropIcon from '@mui/icons-material/PinDrop';

import variables from '@/styles/variables.module.scss';
import { DeliveryAddressIndicatorPartsFragment } from '@/components/domain/DeliveryAddressIndicator/DeliveryAddressIndicator.fragment.generated';
import { DeliveryAddressDialog } from '@/components/domain/DeliveryAddressDialog';
import { HomeClickableCard } from '@/components/ui/HomeClickableCard';
import { ChevronDownIcon } from '@/components/ui/Icons/ChevronDownIcon';

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
      <HomeClickableCard onClick={deliveryAddressDialogState.onOpen}>
        <HStack align="center" justify="space-between" w="full">
          <VStack align="start" spacing="4px" isTruncated>
            <Text className="bold-extra-small" color={variables.monoSecondary}>
              お届け先
            </Text>
            <HStack spacing="10px">
              <Icon as={PinDropIcon} boxSize="24px" />
              <Text className="bold-small">{addressText}</Text>
            </HStack>
          </VStack>
          <Icon as={ChevronDownIcon} boxSize="16px" />
        </HStack>
      </HomeClickableCard>
    </>
  );
};
