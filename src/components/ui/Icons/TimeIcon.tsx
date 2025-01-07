import { Icon } from '@chakra-ui/react';
import { ComponentProps } from 'react';

export const TimeIcon = (props: ComponentProps<typeof Icon>) => {
  return (
    <Icon {...props} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M4 12c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8-8 3.58-8 8Zm-2 0C2 6.48 6.47 2 11.99 2 17.52 2 22 6.48 22 12s-4.48 10-10.01 10C6.47 22 2 17.52 2 12Zm9-5h1.5v5.25l4.5 2.67-.75 1.23L11 13V7Z"
        clipRule="evenodd"
      />
    </Icon>
  );
};
