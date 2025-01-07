import { Icon } from '@chakra-ui/react';
import { ComponentProps } from 'react';

export const CheckCircleIcon = (props: ComponentProps<typeof Icon>) => {
  return (
    <Icon {...props} viewBox="0 0 171 170" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="85.5" cy="85" r="85" fill="currentColor" fillOpacity="0.1" />
      <circle cx="85.5001" cy="85" r="69.8214" fill="currentColor" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M134.583 65.7103C137.36 62.9334 137.36 58.4311 134.583 55.6541C131.806 52.8772 127.304 52.8772 124.527 55.6541L69.4755 110.706L46.6128 87.4263C43.8611 84.6244 39.359 84.5837 36.5571 87.3355C33.7551 90.0872 33.7145 94.5894 36.4662 97.3913L64.3487 125.782C66.9661 128.447 71.1671 128.614 73.9823 126.256C74.1748 126.1 74.361 125.933 74.54 125.754L134.583 65.7103Z"
        fill="white"
      />
    </Icon>
  );
};
