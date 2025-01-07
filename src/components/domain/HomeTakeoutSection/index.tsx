import { useDisclosure } from '@chakra-ui/react';
import { FC } from 'react';

import { HomeTakeoutSectionPartsFragment } from '@/components/domain/HomeTakeoutSection/HomeTakeoutSection.generated';
import { ScheduledOrderTimeListDialog } from '@/components/domain/ScheduledOrderTimeListDialog';
import { OrderType } from '@/graphql/generated/types';
import { SelectScheduledTimeCard } from '@/components/ui/SelectScheduledTimeCard';

type Props = {
  fragment?: HomeTakeoutSectionPartsFragment;
};

export const HomeTakeoutSection: FC<Props> = ({ fragment }: Props) => {
  const scheduledOrderTimeListDialogState = useDisclosure();
  if (!fragment || fragment.selectedScheduledTime === '') {
    return null;
  }

  return (
    <>
      <ScheduledOrderTimeListDialog
        isOpen={scheduledOrderTimeListDialogState.isOpen}
        onClose={scheduledOrderTimeListDialogState.onClose}
        orderType={OrderType.Takeout}
      />
      <SelectScheduledTimeCard
        title="受け取り時間"
        selectedScheduledTime={fragment.selectedScheduledTime}
        orderType={OrderType.Takeout}
      />
    </>
  );
};
