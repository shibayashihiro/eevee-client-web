import React, { FC } from 'react';
import { Center, Text } from '@chakra-ui/react';

type Props = {
  title: string;
};

export const SuspendedBanner: FC<Props> = ({ title }) => {
  return (
    <Center backgroundColor="mono.primary" p="32px" borderRadius="12px" w="full">
      <Text color="mono.white" className="bold-small" verticalAlign="middle">
        {title}
      </Text>
    </Center>
  );
};
