import { HStack, Text } from '@chakra-ui/react';

import variables from '@/styles/variables.module.scss';

export const TableNumber = ({ tableName }: { tableName: string }) => {
  return (
    <HStack spacing="4px">
      <Text fontSize="12px" color={variables.monoSecondary} fontWeight="600">
        席番号
      </Text>
      <Text className="bold-normal" color={variables.monoPrimary} fontWeight="600">
        {tableName}
      </Text>
    </HStack>
  );
};
