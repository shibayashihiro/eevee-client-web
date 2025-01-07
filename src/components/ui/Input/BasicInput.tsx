import { Input } from '@chakra-ui/react';
import { ComponentProps, FC } from 'react';

export type Props = ComponentProps<typeof Input>;

export const BasicInput: FC<Props> = (props) => {
  return (
    <Input
      h="48px"
      className="bold-medium"
      bg="mono.bg"
      color="mono.primary"
      border="0"
      focusBorderColor="mono.hint"
      {...props}
    />
  );
};
