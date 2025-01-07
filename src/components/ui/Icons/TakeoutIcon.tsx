import { Icon } from '@chakra-ui/react';
import { ComponentProps } from 'react';

export const TakeoutIcon = (props: ComponentProps<typeof Icon>) => {
  return (
    <Icon {...props} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M16 7V5c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H2v13c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V7h-6Zm-6-2h4v2h-4V5Z"
      />
    </Icon>
  );
};
