import { Icon } from '@chakra-ui/react';
import { ComponentProps } from 'react';

export const CheckIcon = (props: ComponentProps<typeof Icon>) => {
  return (
    <Icon {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.42896 11.4142L3.66119 13.182L7.55028 17.0711L9.31805 18.8389L11.0858 17.0711L21.3389 6.81805L19.5711 5.05028L9.31805 15.3033L5.42896 11.4142Z"
        fill="currentColor"
      />
    </Icon>
  );
};
