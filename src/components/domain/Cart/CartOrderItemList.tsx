import { Divider, VStack } from '@chakra-ui/react';

type Props = {
  children: React.ReactNode;
};

export const CartOrderItemList = ({ children }: Props) => {
  return (
    <VStack
      as="section"
      spacing="0px"
      align="stretch"
      borderTop="1px solid"
      borderBottom="1px solid"
      borderColor="mono.backGround"
      divider={<Divider as="div" />}
    >
      {children}
    </VStack>
  );
};
