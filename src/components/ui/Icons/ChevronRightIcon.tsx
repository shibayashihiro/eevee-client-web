import { Icon } from '@chakra-ui/react';
import { ComponentProps } from 'react';

export const ChevronRightIcon = (props: ComponentProps<typeof Icon>) => {
  return (
    <Icon {...props} viewBox="0 0 20 20">
      <path fill="currentColor" d="M5.8335 15.1002L10.9842 10.0002L5.8335 4.90016L7.41919 3.3335L14.1668 10.0002L7.41919 16.6668L5.8335 15.1002Z" />
    </Icon>
  );
};
