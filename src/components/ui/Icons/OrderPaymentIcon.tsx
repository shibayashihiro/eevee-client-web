import { Icon } from '@chakra-ui/react';
import { ComponentProps } from 'react';

export const OrderPaymentIcon = (props: ComponentProps<typeof Icon>) => {
  return (
    <Icon {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12ZM4 12C4 16.41 7.59 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4C7.59 4 4 7.59 4 12Z"
        fill="currentColor"
      />
      <path
        d="M16 7L13.9528 11.5827H15.874V12.9213H13.2598L12.9291 13.6299V14.1969H15.874V15.5354H12.9291V17.8031H10.9606V15.5354H8V14.1969H10.9606V13.6299L10.6299 12.9213H8V11.5827H10.252L8.18898 7H10.2362L12.0787 11.7244L14 7H16Z"
        fill="currentColor"
      />
    </Icon>
  );
};
