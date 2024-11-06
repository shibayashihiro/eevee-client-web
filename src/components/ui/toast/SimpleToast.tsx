import { Center, Text, useToast } from '@chakra-ui/react';
import { useCallback } from 'react';

type Props = {
  title: string;
};

export const useSimpleToast = () => {
  const toast = useToast();

  const showToast = useCallback(
    (title: string) => {
      return toast({
        isClosable: true,
        position: 'top',
        containerStyle: {
          marginTop: '22px',
          minHeight: 'auto',
          minWidth: 'auto',
        },
        render: () => <SimpleToast title={title} />,
      });
    },
    [toast],
  );

  return showToast;
};

export const SimpleToast = ({ title }: Props) => (
  <Center
    bg="white"
    p="16px 32px"
    borderRadius="30px"
    backdropFilter="blur(80px)"
    boxShadow="0px 4px 20px 0px rgba(0, 0, 0, 0.1)"
  >
    <Text className="bold-extra-small">{title}</Text>
  </Center>
);
