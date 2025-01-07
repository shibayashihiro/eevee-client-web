import { Icon } from '@chakra-ui/react';
import { ComponentProps } from 'react';

export const ChevronDownIcon = (props: ComponentProps<typeof Icon>) => {
  return (
    <Icon {...props} viewBox="0 0 24 24">
      <path fill="currentColor" d="M5.88 7 12 13.18 18.12 7 20 8.903 12 17 4 8.903 5.88 7Z" />
    </Icon>
  );
};
