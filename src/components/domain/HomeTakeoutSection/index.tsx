import { HStack, VStack, Text, useDisclosure, Icon } from '@chakra-ui/react';
import { FC } from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ScheduleIcon from '@mui/icons-material/Schedule';

import { HomeTakeoutSectionPartsFragment } from '@/components/domain/HomeTakeoutSection/HomeTakeoutSection.generated';
import { ScheduledOrderTimeListDialog } from '@/components/domain/ScheduledOrderTimeListDialog';
import { OrderType } from '@/graphql/generated/types';

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

      <HStack
        w="full"
        py="12px"
        px="16px"
        justifyContent="space-between"
        border={'1px'}
        borderColor="mono.bg"
        borderRadius="12px"
        bgColor="mono.white"
        onClick={scheduledOrderTimeListDialogState.onOpen}
      >
        <VStack spacing={0} w="full" alignItems="start">
          <Text className="bold-extra-small" color="mono.secondary">
            受け取り時間
          </Text>
          <HStack pt="8px" w="full">
            <Icon as={ScheduleIcon} w="18px" h="18px" />
            <Text className="bold-small">{fragment.selectedScheduledTime}</Text>
          </HStack>
        </VStack>
        <Icon as={ChevronRightIcon} color="mono.hint" />
      </HStack>
    </>
  );
};
