import React, { FC, useState, useCallback, useEffect } from 'react';
import { Box, Center, Circle, Icon, LinkBox, Text, VStack } from '@chakra-ui/react';
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
  return (
    <>
      <Text className="bold-large" mx={containerMarginX} mb="32px">
        {title}
      </Text>
      <MenuCategories categories={categories} orderType={orderType} />
    </>
  );
};

// 「すべて見る」を表示する商品数
const showAllButtonMenuItemCount = 5;

const MenuCategories = ({
  categories,
  orderType,
}: {
  categories?: HomeMenuCategoriesSectionPartsFragment['categories'];
  orderType: OrderType;
}) => {
  const { showPriceExcludingTax } = useFeatureFlags();

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

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
  if (!categories) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <VStack align="stretch" spacing="32px">
        {categories.map((category) => {
          if (category.items.nodes.length === 0) {
            return null;
          }
          return (
            <MenuCategoryCarousel
              key={category.id}
              categoryName={category.name}
              onShowAllClick={() => openCategoryModal(category.id, category.name)}
              paddingX={containerMarginX}
            >
              {category.items.nodes.slice(0, maxVisibleMenuItems).map((menuItem, i) => (
                <MenuCategoryCarousel.Item
                  key={i}
                  image={menuItem.image || null}
                  name={menuItem.name}
                  price={menuItem.price}
                  priceExcludingTax={showPriceExcludingTax ? menuItem.priceExcludingTax : undefined}
                  unavailableReason={menuItem.status.available ? null : menuItem.status.labelUnavailable}
                  onClick={() => openItemModal(menuItem)}
                />
              ))}
              <>
                {category.items.nodes.length >= showAllButtonMenuItemCount && (
                  <LinkBox
                    as="li"
                    w={{ base: '120px', md: '200px' }}
                    h="auto"
                    flexShrink={0}
                    listStyleType="none"
                    display="flex"
                  >
                    <Box
                      h="100%"
                      as="a"
                      onClick={() => openCategoryModal(category.id, category.name)}
                      display="block"
                      w="100%"
                    >
                      <Center h="100%" bgColor="brand.backgroundSoft" w="100%" borderRadius="md">
                        <VStack>
                          <Circle size="60px" borderWidth={2} borderColor="brand.backgroundSoft" color="brand.primary">
                            <Icon as={ArrowForwardIos} />
                          </Circle>
                          <Text className="bold-small" color="brand.primary" whiteSpace="pre-line" textAlign="center">
                            すべて見る
                          </Text>
                        </VStack>
                      </Center>
                    </Box>
                  </LinkBox>
                )}
              </>
            </MenuCategoryCarousel>
          );
        })}
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
        {selectedCategoryId && (
          <MenuCategoryDetailModalContent
            categoryId={selectedCategoryId}
            orderType={orderType}
            closeCategoryModal={closeCategoryModal}
          />
        )}
      </SwipeableBottomModal>
    </>
  );
};
