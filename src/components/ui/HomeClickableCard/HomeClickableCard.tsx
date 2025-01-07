import { VStack } from '@chakra-ui/react';

type Props = {
  children: React.ReactNode;
  onClick: () => void;
};

export const HomeClickableCard = ({ children, onClick }: Props) => (
  <VStack
    as="button"
    w="full"
    border="1px"
    borderColor="mono.bg"
    bgColor="mono.white"
    borderRadius="12px"
    p="12px"
    spacing="8px"
    align="start"
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        onClick();
      }
    }}
    _hover={{
      bgColor: 'mono.backGroundLight',
    }}
  >
    {children}
  </VStack>
);
