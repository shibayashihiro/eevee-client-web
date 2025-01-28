import { HStack, VStack, Text, Flex, Box } from '@chakra-ui/react';
import { ComponentProps } from 'react';

import { CarouselItem } from './CarouselItem';

type Props = {
  children: React.ReactNode;
  categoryName: string;
  onShowAllClick?: () => void;
  paddingX?: ComponentProps<typeof Box>['px'];
};

const MenuCategoryCarousel = ({ children, categoryName, onShowAllClick, paddingX }: Props) => {
  return (
    <VStack align="stretch" spacing="12px">
      <HStack justify="space-between" mx={paddingX}>
        <Text className="text-large">{categoryName}</Text>
        {onShowAllClick && (
          <Text as="button" className="text-small" color="brand.primaryText" onClick={onShowAllClick}>
            すべて見る
          </Text>
        )}
      </HStack>
      <Flex as="ul" w="full" overflow="hidden" overflowX="scroll" px={paddingX}>
        {children}
      </Flex>
    </VStack>
  );
};

MenuCategoryCarousel.Item = CarouselItem;

export { MenuCategoryCarousel };
