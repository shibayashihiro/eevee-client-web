import React, { FC } from 'react';
import { Box, Text, SimpleGrid } from '@chakra-ui/react';

import { MenuItemImage } from '@/components/ui/MenuItemImage';
import { OrderType } from '@/graphql/generated/types';
import { menuItemDetailPage } from '@/utils/paths/facilityPages';
import { useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import { useFeatureFlags } from '@/providers/FeatureFlagsProvider';

import { TenantPageLink } from '../TenantPageLink';
import { CarouselItemPrice } from '../MenuCategoryCarousel/CarouselItemPrice';

import { HomeMenuItemsSectionPartsFragment } from './HomeMenuItemsSection.fragment.generated';

export * from './HomeMenuItemsSection.fragment.generated';

type Props = {
  menuItemsSection: HomeMenuItemsSectionPartsFragment;
  orderType: OrderType;
};

export const HomeMenuItemsSection: FC<Props> = ({ menuItemsSection, orderType }: Props) => {
  const { title, items } = menuItemsSection;
  const facilityId = useFacilityId();
  const imageSize = { base: '160px', md: '272px' };
  const { showPriceExcludingTax } = useFeatureFlags();
  return (
    <>
      <Box>
        <Text className="bold-large">{title}</Text>
      </Box>
      <SimpleGrid mt="16px" columns={2} spacing="16px">
        {items.map((item, i) => (
          <Box key={i}>
            <MenuItemImage
              href={menuItemDetailPage(facilityId, item.id, orderType)}
              image={item.image || undefined}
              name={item.name}
              boxSize={imageSize}
            />
            <Text mt="8px" className="bold-small">
              <TenantPageLink href={menuItemDetailPage(facilityId, item.id, orderType)}>{item.name}</TenantPageLink>
            </Text>
            <Box mt="4px">
              {/* NOTE: ここでCarouselItemPriceを使うのは少し違和感あるが、MenuItemSection自体が現状使われておらず
                        もし将来頻繁に使われる場合は機能ごと修正されることを想定して楽な方法を取っている。 */}
              <CarouselItemPrice
                price={item.price}
                priceExcludingTax={showPriceExcludingTax ? item.priceExcludingTax : undefined}
                unavailableReason={item.status.available ? null : item.status.labelUnavailable}
              />
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </>
  );
};
