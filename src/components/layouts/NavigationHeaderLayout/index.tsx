import { Box, Flex } from '@chakra-ui/react';
import { ComponentProps } from 'react';

import { Navbar } from '@/components/domain/Navbar';

type Props = {
  children: React.ReactNode;
} & ComponentProps<typeof Navbar>;

export const NavigationHeaderLayout = ({ children, ...props }: Props) => {
  return (
    <Flex h="100vh" direction="column">
      <Navbar {...props} />
      <Box flex={1}>{children}</Box>
    </Flex>
  );
};
