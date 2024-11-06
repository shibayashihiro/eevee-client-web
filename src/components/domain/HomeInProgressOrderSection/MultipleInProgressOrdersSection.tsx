import { FC } from 'react';
import { HStack, Icon, Text, useDisclosure } from '@chakra-ui/react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { HomeInProgressOrderSectionPartsFragment } from '@/components/domain/HomeInProgressOrderSection/HomeInProgressOrderSection.fragment.generated';
import { ListInProgressOrderDialog } from '@/components/domain/HomeInProgressOrderSection/ListInProgressOrderDialog';

type Props = {
  fragment: HomeInProgressOrderSectionPartsFragment;
};

export const MultipleInProgressOrderSection: FC<Props> = ({ fragment }: Props) => {
  const selectInProgressOrderState = useDisclosure();

  return (
    <>
      <ListInProgressOrderDialog
        fragment={fragment}
        isOpen={selectInProgressOrderState.isOpen}
        onClose={selectInProgressOrderState.onClose}
      />
      <HStack
        w="full"
        h="42px"
        py="12px"
        px="16px"
        justifyContent="space-between"
        border="1px"
        borderColor="mono.bg"
        borderRadius="12px"
        bgColor="mono.white"
        onClick={selectInProgressOrderState.onOpen}
      >
        <Text className="bold-small">{fragment.orders.length}件のご注文を承っております</Text>
        <Icon as={ChevronRightIcon} color="mono.hint" />
      </HStack>
    </>
  );
};
