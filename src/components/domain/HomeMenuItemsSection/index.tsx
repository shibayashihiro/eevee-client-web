import React, { FC, useCallback, useState } from 'react';
import { Box, Text, SimpleGrid, Image } from '@chakra-ui/react';

import { OrderType } from '@/graphql/generated/types';
import { useFeatureFlags } from '@/providers/FeatureFlagsProvider';
import { NoImage } from '@/components/ui/NoImage';
import { SwipeableBottomModal } from '@/components/ui/SwipeableBottomModalDialog';

import { MenuItemDetailModalContent } from '../MenuItemDetailMoalContent';
import { CarouselItemPrice } from '../MenuCategoryCarousel/CarouselItemPrice';

import { HomeMenuItemsSectionPartsFragment } from './HomeMenuItemsSection.fragment.generated';

export * from './HomeMenuItemsSection.fragment.generated';

type Props = {
  menuItemsSection: HomeMenuItemsSectionPartsFragment;
  orderType: OrderType;
};
type item = HomeMenuItemsSectionPartsFragment['items'][0];
export const HomeMenuItemsSection: FC<Props> = ({ menuItemsSection, orderType }: Props) => {
  const { title, items } = menuItemsSection;
  const [selectedItem, setSelectedItem] = useState<item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback((item: item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const imageSize = { base: '160px', md: '272px' };
  const { showPriceExcludingTax } = useFeatureFlags();
  return (
    <>
      <Box>
        <Text className="bold-large">{title}</Text>
      </Box>
      <SimpleGrid mt="16px" columns={2} spacing="16px">
        {items.map((item, i) => (
          <Box key={i} onClick={() => openModal(item)} >
            <Image
              src={item.image?.includes('img_placeholder_') ? undefined : item.image}
              alt={item.name}
              boxSize={imageSize}
              fallback={<NoImage rounded="4px" boxSize={imageSize} />}
              rounded="4px"
              objectFit="cover"
            />
            <Text mt="8px" className="bold-small">
              {item.name}
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
      <SwipeableBottomModal
        isOpen={isModalOpen && !!selectedItem?.id}
        onClose={closeModal}
        title={selectedItem?.name || ''}
        footer={null}
      >
      {selectedItem?.id && (
        <MenuItemDetailModalContent menuItemId={selectedItem.id} orderType={orderType} /> 
      )}
    </SwipeableBottomModal>
    </>
  );
};
