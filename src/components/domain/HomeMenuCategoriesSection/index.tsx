import React, { FC } from 'react';
import { Box, Center, Circle, Icon, LinkBox, Text, VStack } from '@chakra-ui/react';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';

import { OrderType } from '@/graphql/generated/types';
import { menuCategoryDetailPage, menuItemDetailPage } from '@/utils/paths/facilityPages';
import { useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import { containerMarginX } from '@/utils/constants';
import { useFeatureFlags } from '@/providers/FeatureFlagsProvider';

import { MenuCategoryCarousel } from '../MenuCategoryCarousel';
import { TenantPageLinkOverlay } from '../TenantPageLink';

import { HomeMenuCategoriesSectionPartsFragment } from './HomeMenuCategoriesSection.fragment.generated';

export * from './HomeMenuCategoriesSection.fragment.generated';

type Props = {
  menuCategoriesSection: HomeMenuCategoriesSectionPartsFragment;
  orderType: OrderType;
};

// 本来はGraphQL QueryのPager Inputで制御するべきだが、PISOLAさまで常に100件データを返してもらう事情ができたため
// それが解決するまではClient側で表示件数を制御する
const maxVisibleMenuItems = 10;

export const HomeMenuCategoriesSection: FC<Props> = ({ menuCategoriesSection, orderType }: Props) => {
  const facilityId = useFacilityId();
  const { title, categories } = menuCategoriesSection;

  const { showPriceExcludingTax } = useFeatureFlags();
  const showAllButtonMenuItemCount = 5;

  return (
    <>
      <Text className="bold-large" mx={containerMarginX} mb="32px">
        {title}
      </Text>
      <VStack align="stretch" spacing="32px">
        {categories.map((category) => {
          if (category.items.nodes.length === 0) {
            return null;
          }
          return (
            <MenuCategoryCarousel
              key={category.id}
              categoryName={category.name}
              pathToShowAll={menuCategoryDetailPage(facilityId, category.id, orderType)}
              paddingX={containerMarginX}
            >
              {category.items.nodes.slice(0, maxVisibleMenuItems).map((menuItem, i) => (
                <MenuCategoryCarousel.Item
                  key={i}
                  pathToDetail={menuItemDetailPage(facilityId, menuItem.id, orderType)}
                  image={menuItem.image || null}
                  name={menuItem.name}
                  price={menuItem.price}
                  priceExcludingTax={showPriceExcludingTax ? menuItem.priceExcludingTax : undefined}
                  unavailableReason={menuItem.status.available ? null : menuItem.status.labelUnavailable}
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
                    <TenantPageLinkOverlay
                      href={menuCategoryDetailPage(facilityId, category.id, orderType)}
                      display="block"
                      w="100%"
                    >
                      <Box h="100%">
                        <Center h="100%" bgColor="brand.backgroundSoft" w="100%" borderRadius="md">
                          <VStack>
                            <Circle
                              size="60px"
                              borderWidth={2}
                              borderColor="brand.backgroundSoft"
                              color="brand.primary"
                            >
                              <Icon as={ArrowForwardIos} />
                            </Circle>
                            <Text className="bold-small" color="brand.primary" whiteSpace="pre-line" textAlign="center">
                              すべて見る
                            </Text>
                          </VStack>
                        </Center>
                      </Box>
                    </TenantPageLinkOverlay>
                  </LinkBox>
                )}
              </>
            </MenuCategoryCarousel>
          );
        })}
      </VStack>
    </>
  );
};
