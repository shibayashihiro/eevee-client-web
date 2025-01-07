import { HStack, Text, useDisclosure, Icon } from '@chakra-ui/react';

import { OrderType } from '@/graphql/generated/types';

import { ScheduledOrderTimeListDialog } from '../../domain/ScheduledOrderTimeListDialog';
import { TimeIcon } from '../Icons/TimeIcon';
import { ChevronDownIcon } from '../Icons/ChevronDownIcon';
import { HomeClickableCard } from '../HomeClickableCard';

export type Props = {
  title: string;
  selectedScheduledTime: string;
  feeAmount?: string;
  orderType: OrderType;
};

export const SelectScheduledTimeCard = (props: Props) => {
  const { isOpen: isDialogOpen, onOpen: openDialog, onClose: isDialogClose } = useDisclosure();
  return (
    <>
      <ScheduledOrderTimeListDialog isOpen={isDialogOpen} onClose={isDialogClose} orderType={props.orderType} />
      <SelectedScheduledTimeCardLayout {...props} onClick={openDialog} />
    </>
  );
};

const SelectedScheduledTimeCardLayout = ({
  title,
  selectedScheduledTime,
  feeAmount,
  onClick,
}: Props & {
  onClick: () => void;
}) => {
  return (
    <HomeClickableCard onClick={onClick}>
      <Text textStyle="bold-extra-small" color="mono.secondary">
        {title}
      </Text>
      <SelectedScheduledTime scheduledTime={selectedScheduledTime} />
      {feeAmount && <ServiceFee feeName="配送手数料" feeAmount={feeAmount} />}
    </HomeClickableCard>
  );
};

const SelectedScheduledTime = ({ scheduledTime }: { scheduledTime: string }) => {
  return (
    <HStack w="full" justifyContent="space-between">
      <HStack spacing="4px">
        <Icon as={TimeIcon} boxSize="20px" />
        <Text textStyle="bold-small">{scheduledTime}</Text>
      </HStack>
      <Icon as={ChevronDownIcon} boxSize="16px" />
    </HStack>
  );
};

const ServiceFee = ({ feeName, feeAmount }: { feeName: string; feeAmount: string }) => {
  return (
    <HStack
      h="44px"
      py="14px"
      px="12px"
      w="full"
      rounded="8px"
      backgroundColor="brand.backgroundSoft"
      justifyContent="space-between"
    >
      <Text textStyle="bold-extra-small" color="brand.primary">
        {feeName}
      </Text>
      <Text textStyle="bold-small" color="brand.primary">
        {feeAmount}
      </Text>
    </HStack>
  );
};
