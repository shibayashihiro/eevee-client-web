import { HStack, Text } from '@chakra-ui/react';

import { ErrorIcon } from '../Icons/ErrorIcon';

type Props = {
  message: string;
};

export const InputErrorMessage = ({ message }: Props) => {
  return (
    <HStack spacing="4px" bg="mono.errorBackground" color="mono.error" px="4px" py="2px" rounded="4px">
      <ErrorIcon boxSize="14px" />
      <Text className="bold-extra-small">{message}</Text>
    </HStack>
  );
};
