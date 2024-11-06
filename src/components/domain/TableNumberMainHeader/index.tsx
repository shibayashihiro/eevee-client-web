import { HStack, Text } from '@chakra-ui/react';

import { TableNumberMainHeaderPartsFragment } from './TableNumberMainHeader.fragment.generated';

type Props = {
  table: TableNumberMainHeaderPartsFragment;
};

export const TableNumberMainHeader = ({ table }: Props) => {
  return (
    <HStack as="header" spacing="12px" py="24px" w="full" bgColor="mono.backGround" justifyContent="center">
      <Title />
      <Number tableNumber={table.name} />
    </HStack>
  );
};

const Title = () => {
  return (
    <Text
      px="12px"
      py="4px"
      bgColor="mono.primary"
      color="mono.white"
      borderRadius="16px"
      fontSize="sm"
      fontWeight="semibold"
    >
      席番号
    </Text>
  );
};

const Number = ({ tableNumber }: { tableNumber: string }) => {
  return (
    <Text color="mono.primary" fontSize="32px" fontWeight="semibold">
      {tableNumber}
    </Text>
  );
};
