import { Container, Flex } from '@chakra-ui/react';
import { ComponentProps } from 'react';

import { Navbar } from '@/components/domain/Navbar';

type Props = {
  children: React.ReactNode;
  subHeader?: React.ReactNode;
  footer?: React.ReactNode;
} & ComponentProps<typeof Navbar>;

export const NavigationHeaderLayout = ({ children, subHeader, footer, ...props }: Props) => {
  return (
    <Flex h="100vh" direction="column">
      <Navbar {...props} />
      {subHeader && subHeader}
      <Container flex={1}>{children}</Container>
      {footer && footer}
    </Flex>
  );
};
