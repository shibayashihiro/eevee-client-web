import { Icon } from '@chakra-ui/react';
import { ComponentProps } from 'react';

export const RightIcon = (props: ComponentProps<typeof Icon>) => {
  return (
    <Icon {...props} viewBox="0 0 24 24">
      <path d="M7 18.12L13.1808 12L7 5.88L8.90283 4L17 12L8.90283 20L7 18.12Z" fill="currentColor" />
    </Icon>
  );
};
