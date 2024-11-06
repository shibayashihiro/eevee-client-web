import { VStack, Text } from '@chakra-ui/react';

type Props = {
  icon: React.ReactNode;
  message: string;
  description?: string;
};

export const NoData = ({ icon, message, description }: Props) => {
  return (
    <VStack align="center" spacing="24px">
      {icon}
      <VStack align="center" spacing="12px">
        <Text className="bold-large">{message}</Text>
        {description && (
          <Text textAlign="center" whiteSpace="pre-wrap">
            {description}
          </Text>
        )}
      </VStack>
    </VStack>
  );
};
