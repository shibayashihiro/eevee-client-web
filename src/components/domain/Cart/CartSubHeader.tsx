import { Heading } from '@chakra-ui/react';
import { ComponentProps } from 'react';

type Props = {
  children: React.ReactNode;
} & ComponentProps<typeof Heading>;

export const CartSubHeader = ({ children, ...props }: Props) => {
  return (
    <Heading
      as="h3"
      className="bold-extra-small"
      color="mono.secondary"
      mb="8px"
      fontSize="12px"
      lineHeight="16.8px"
      {...props}
    >
      {children}
    </Heading>
  );
};
