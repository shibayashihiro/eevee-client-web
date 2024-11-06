import { Icon } from '@chakra-ui/react';
import { ComponentProps } from 'react';

export const OrderHistoryIcon = (props: ComponentProps<typeof Icon>) => {
  return (
    <Icon {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4 5C4 3.89543 4.89543 3 6 3H18C19.1046 3 20 3.89543 20 5V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V5ZM6 5H18V19H6V5ZM16 10H8V8H16V10ZM8 11V13H16V11H13H8ZM16 16H8V14H16V16Z"
        fill="currentColor"
      />
    </Icon>
  );
};
