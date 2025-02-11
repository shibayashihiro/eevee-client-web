import { Icon } from '@chakra-ui/react';
import { ComponentProps } from 'react';

export const RightArrowIcon = (props: ComponentProps<typeof Icon>) => {
  return (
    <Icon {...props} viewBox="0 0 16 16">
      <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor" />
    </Icon>
  );
};
