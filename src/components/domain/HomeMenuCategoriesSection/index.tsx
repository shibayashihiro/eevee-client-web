import React, { FC, useState, useCallback, useEffect } from 'react';
import { Box, Center, Circle, Icon, LinkBox, SimpleGrid, Text, VStack, Image } from '@chakra-ui/react';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';

import { OrderType } from '@/graphql/generated/types';
import { containerMarginX } from '@/utils/constants';
import { useFeatureFlags } from '@/providers/FeatureFlagsProvider';
import { SwipeableBottomModal } from '@/components/ui/SwipeableBottomModalDialog';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

import { MenuItemDetailModalContent } from '../MenuItemDetailMoalContent';
import { MenuCategoryCarousel } from '../MenuCategoryCarousel';
import { MenuCategoryDetailModalContent } from '../MenuCategoryDetailModalContent';

import { HomeMenuCategoriesSectionPartsFragment } from './HomeMenuCategoriesSection.fragment.generated';
import { CarouselItemPrice } from '../MenuCategoryCarousel/CarouselItemPrice';
import { safeImage } from '@/utils/image';
import { NoImage } from '@/components/ui/NoImage';
import FooterNavigation from '../FooterNavigation';

export * from './HomeMenuCategoriesSection.fragment.generated';

type Props = {
  menuCategoriesSection: HomeMenuCategoriesSectionPartsFragment;
  orderType: OrderType;
};

// 本来はGraphQL QueryのPager Inputで制御するべきだが、PISOLAさまで常に100件データを返してもらう事情ができたため
// それが解決するまではClient側で表示件数を制御する
const maxVisibleMenuItems = 10;

type MenuItem = NonNullable<HomeMenuCategoriesSectionPartsFragment['categories']>[0]['items']['nodes'][0];

export const HomeMenuCategoriesSection: FC<Props> = ({ menuCategoriesSection, orderType }: Props) => {
  const { title, categories } = menuCategoriesSection;
  if (!categories || categories.length === 0) {
    return <LoadingSpinner />;
  }

  const firstCategory = categories[0];
  return (
    <> 
      <Box p="20px">   
        <MenuCategories category={firstCategory} orderType={orderType} />
      </Box>  
      
    </>
  );
};

// 「すべて見る」を表示する商品数
const showAllButtonMenuItemCount = 5;

const MenuCategories = ({
  category,
  orderType,
}: {
  category: HomeMenuCategoriesSectionPartsFragment['categories'][0];
  orderType: OrderType;
}) => {
  const { showPriceExcludingTax } = useFeatureFlags();

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  if (!category || !category.items?.nodes || category.items.nodes.length === 0) {
    return null;
  }
  const openItemModal = useCallback((menuItem: MenuItem) => {
    setSelectedItem(menuItem);
    setIsItemModalOpen(true);
  }, []);

  const closeItemModal = useCallback(() => {
    setIsItemModalOpen(false);
    setSelectedItem(null);
  }, []);

  const openCategoryModal = useCallback((categoryId: string, categoryName: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedCategoryName(categoryName);
    setIsCategoryModalOpen(true);
  }, []);

  const closeCategoryModal = useCallback(() => {
    setIsCategoryModalOpen(false);
    setSelectedCategoryName(null);
    setSelectedCategoryId(null);
  }, []);
  useEffect(() => {
    if (isItemModalOpen || isCategoryModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = ''; // クリーンアップ
    };
  }, [isItemModalOpen, isCategoryModalOpen]);

  // categoriesがundefinedということは、deferによる遅延取得中ということなので、ローディングを表示
  if (!category) {
    return <LoadingSpinner />;
  }

  return (
    <>
    
      <VStack spacing="40px" align="stretch">         
            <VStack align="stretch" spacing="15px">
            <Box>
              <Text className="bold-large">{category.name}</Text>
            </Box>
            <SimpleGrid mt="9px" columns={2} spacing="15px">
                {category.items.nodes.map((menuItem, i) => (
                <Box key={i} onClick={() => openItemModal(menuItem)}>
                  <Image
                    src={safeImage(menuItem.image)}
                    alt={menuItem.name}
                    boxSize={{ base: '160px', md: '272px' }}
                    fallback={<NoImage rounded="4px" boxSize={{ base: '160px', md: '272px' }} />}
                    rounded="4px"
                    objectFit="cover"
                  />
                  <Text mt="8px" className="bold-small">
                    {menuItem.name}
                  </Text>
                  <Box mt="4px">
                    {/* NOTE: ここでCarouselItemPriceを使うのは少し違和感あるが、MenuItemSection自体が現状使われておらず
                              もし将来頻繁に使われる場合は機能ごと修正されることを想定して楽な方法を取っている。 */}
                    <CarouselItemPrice
                      price={menuItem.price}
                      priceExcludingTax={showPriceExcludingTax ? menuItem.priceExcludingTax : undefined}
                      unavailableReason={menuItem.status.available ? null : menuItem.status.labelUnavailable}
                    />
                  </Box>
                </Box>
              ))}
            </SimpleGrid>              
            </VStack> 
         </VStack>
      <SwipeableBottomModal
        isOpen={isItemModalOpen && !!selectedItem?.id}
        onClose={closeItemModal}
        title={selectedItem?.name || ''}
        footer={null}
      >
        {selectedItem?.id && (
          <MenuItemDetailModalContent menuItemId={selectedItem.id} orderType={orderType} closeModal={closeItemModal} />
        )}
      </SwipeableBottomModal>
      <SwipeableBottomModal
        isOpen={isCategoryModalOpen && !!selectedCategoryId}
        onClose={closeCategoryModal}
        title={selectedCategoryName ? selectedCategoryName : ''}
        footer={null}
      >
        {selectedCategoryId && <MenuCategoryDetailModalContent categoryId={selectedCategoryId} orderType={orderType} closeCategoryModal={closeCategoryModal}/>}
      </SwipeableBottomModal>
    </>
  );
};
