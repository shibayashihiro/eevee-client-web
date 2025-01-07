import { Icon } from '@chakra-ui/react';
import { ComponentProps } from 'react';

export const PersonIcon = (props: ComponentProps<typeof Icon>) => {
  return (
    <Icon {...props} viewBox="0 0 24 24">
      <path
        fill="#currentColor"
        fillRule="evenodd"
        d="M16 8c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4ZM4 18c0-2.66 5.33-4 8-4s8 1.34 8 4v2H4v-2Z"
        clipRule="evenodd"
      />
    </Icon>
  );
};
