import { Text } from '@chakra-ui/react';
import { ComponentProps } from 'react';

import { CartFacilityNamePartsFragment } from './CartFacilityName.fragment.generated';

type Props = {
  facility: CartFacilityNamePartsFragment;
} & ComponentProps<typeof Text>;

export const CartFacilityName = ({ facility, ...props }: Props) => {
  return (
    <Text fontSize="24px" className="bold mono-primary" {...props}>
      {facility.shortName}
    </Text>
  );
};
