import React, { FC } from 'react';
import { Text, VStack } from '@chakra-ui/react';

import { HomeDeliveryScheduledTimeSectionPartsFragment } from '@/components/domain/HomeDeliveryScheduledTimeSection/HomeDeliveryScheduledTimeSection.fragment.generated';
import { SelectScheduledTimeCard } from '@/components/ui/SelectScheduledTimeCard';
import { OrderType } from '@/graphql/generated/types';

type Props = {
  fragment?: HomeDeliveryScheduledTimeSectionPartsFragment;
};

export const HomeDeliveryScheduledTimeSection: FC<Props> = ({ fragment }: Props) => {
  if (!fragment || fragment.scheduledTime == '' || fragment.deliveryFeeAmount == '') {
    return null;
  }
  return (
    <VStack spacing="16px" align="stretch" w="full">
      <SelectScheduledTimeCard
        title="お届け時間"
        selectedScheduledTime={fragment.scheduledTime}
        feeAmount={fragment.deliveryFeeAmount}
        orderType={OrderType.Delivery}
      />
      {fragment.caution && (
        // TODO(suzukenz): info icon をつける
        <Text className="text-extra-small" color="brand.primary" textAlign="right">
          {fragment.caution}
        </Text>
      )}
    </VStack>
  );
};
