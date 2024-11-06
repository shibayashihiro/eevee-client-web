import { Center, Spinner } from '@chakra-ui/react';
import { ComponentProps } from 'react';

type Props = {
  color?: ComponentProps<typeof Spinner>['color'];
};

export const LoadingSpinner = ({ color = 'mono.primary' }: Props) => {
  return (
    <Center p={4}>
      <Spinner color={color} />
    </Center>
  );
};
