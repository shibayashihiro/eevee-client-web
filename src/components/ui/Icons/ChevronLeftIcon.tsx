import { Icon } from '@chakra-ui/react';
import { ComponentProps } from 'react';

export const ChevronLeftIcon = (props: ComponentProps<typeof Icon>) => {
  return (
    <Icon {...props} viewBox="0 0 24 24">
      <path fill="currentColor" d="M17 18.12 10.82 12 17 5.88 15.097 4 7 12l8.097 8L17 18.12Z" />
    </Icon>
  );
};
