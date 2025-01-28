import { Box, Text, Image } from '@chakra-ui/react';

import { safeImage } from '@/utils/image';
import { NoImage } from '@/components/ui/NoImage';

import { CarouselItemPrice } from './CarouselItemPrice';

type Props = {
  name: string;
  price: number;
  priceExcludingTax?: number;
  priceIsRange?: boolean;
  image: string | null;
  unavailableReason?: string | null;
  onClick?: () => void;
};

export const CarouselItem = ({
  name,
  price,
  priceExcludingTax,
  priceIsRange,
  image,
  unavailableReason,
  onClick,
}: Props) => {
  return (
    <Box
      as="li"
      mr="12px"
      w={{ base: '120px', md: '200px' }}
      flexShrink={0}
      listStyleType="none"
      onClick={onClick}
      cursor="pointer"
    >
      <Image
        src={safeImage(image)}
        alt={name}
        boxSize={{ base: '120px', md: '200px' }}
        fallback={<NoImage rounded="4px" boxSize={{ base: '120px', md: '200px' }} />}
        rounded="4px"
        objectFit="cover"
      />
      <Text mt="8px" className="bold-small">
        {name}
      </Text>
      <Box mt="4px">
        <CarouselItemPrice
          price={price}
          priceExcludingTax={priceExcludingTax}
          asRange={priceIsRange}
          unavailableReason={unavailableReason}
        />
      </Box>
    </Box>
  );
};
