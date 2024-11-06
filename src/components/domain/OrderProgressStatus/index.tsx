import { FC } from 'react';
import { Box, HStack, Text } from '@chakra-ui/react';

type Props = {
  lastStep: number;
  currentStep: number;
  stepSubject: string;
  caution: string;
};

export const OrderProgressStatus: FC<Props> = ({ lastStep, currentStep, stepSubject, caution }) => {
  return (
    <>
      <HStack justifyContent="space-between" w="full">
        {[...Array(lastStep)].map((_, index) => (
          <Box w="64px" h="4px" key={index} bgColor={index <= currentStep ? 'brand.background' : 'mono.bg'} />
        ))}
      </HStack>
      <Text className="bold-large" pt="24px">
        {stepSubject}
      </Text>
      {caution && (
        <Text className="bold-extra-small" pt="8px">
          ※{caution}
        </Text>
      )}
    </>
  );
};
