import { HStack, VStack, Text, Flex, Box } from '@chakra-ui/react';
import { ComponentProps } from 'react';

import { TenantPageLink } from '../TenantPageLink';

import { CarouselItem } from './CarouselItem';

type Props = {
  children: React.ReactNode;
  categoryName: string;
  pathToShowAll?: string;
  paddingX?: ComponentProps<typeof Box>['px'];
};

const MenuCategoryCarousel = ({ children, categoryName, pathToShowAll, paddingX }: Props) => {
  return (
    <VStack align="stretch" spacing="12px">
      <HStack justify="space-between" mx={paddingX}>
        <Text className="text-large">{categoryName}</Text>
        {pathToShowAll && (
          <TenantPageLink href={pathToShowAll} color="brand.primaryText">
            <Text className="text-small">すべて見る</Text>
          </TenantPageLink>
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
