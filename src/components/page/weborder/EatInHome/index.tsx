import { Box, HStack, Image, Spacer, TabPanel, Tab, Tooltip, TabList, Tabs, VStack, TabPanels, Button, Flex, Text } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';

import { FixedCartFooterButton } from '@/components/domain/FixedCartFooterButton';
import { HomeBannerSection } from '@/components/domain/HomeBannerSection';
import { HomeBannerSectionPartsFragment } from '@/components/domain/HomeBannerSection/HomeBannerSection.fragment.generated';
import { HomeCourseMenuCategoriesSection } from '@/components/domain/HomeCourseMenuCategoriesSection';
import { HomeCourseMenuCategoriesSectionFragment } from '@/components/domain/HomeCourseMenuCategoriesSection/HomeCourseMenuCategoriesSection.fragment.generated';
import { HomeLastOrderPassedBanner } from '@/components/domain/HomeLastOrderPassedBanner';
import { HomeMembershipCardSection } from '@/components/domain/HomeMembershipCardSection';
import {
  HomeMenuCategoriesSection,
  HomeMenuCategoriesSectionPartsFragment,
} from '@/components/domain/HomeMenuCategoriesSection';
import { HomeMenuItemsSection, HomeMenuItemsSectionPartsFragment } from '@/components/domain/HomeMenuItemsSection';
import { TableCourseMenuStatsHeader } from '@/components/domain/TableCourseMenuStatsHeader';
import { SuspendedBanner } from '@/components/ui/SuspendedBanner';
import {
  EatInOrder,
  MainVisualSection,
  MembershipCardSection,
  OrderType,
  StatusSection,
  UpdateUserCourseMenuNoticeStatusPayload,
} from '@/graphql/generated/types';
import { isFacility, isObjectType, useAdditionalTypeNamesContext } from '@/graphql/helper';
import { FeatureFlagsProvider } from '@/providers/FeatureFlagsProvider';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import { NextPageWithLayout } from '@/types';
import { containerMarginX } from '@/utils/constants';
import { NotFoundError } from '@/utils/errors';
import { NavigationHeaderLayout } from '@/components/layouts/NavigationHeaderLayout';
import { ItemSearchMethodButtonType } from '@/components/domain/Navbar/types';
import { HomeEatInFacilityInfoSection } from '@/components/domain/HomeFacilityInfoSection';

import { GetWebEatInHomeSectionsQuery, useGetWebEatInHomeSectionsQuery } from './EatInHome.query.generated';
import { motion } from "framer-motion";
import FooterNavigation from '@/components/domain/FooterNavigation';
import { TabTest } from '@/components/domain/TabTest';
const orderType = OrderType.EatIn;

export const EatInHome: NextPageWithLayout = () => {
  const facilityId = useFacilityId();

  // EatInOrder は、OrderのMutation(注文実行)後にもキャッシュを更新してほしいため指定
  // NOTE: 現状は setSeatNumber により Cart のMutationを行なっているため無くても良いが、将来の変更を見据えて念の為指定している。
  const context = useAdditionalTypeNamesContext<[EatInOrder, UpdateUserCourseMenuNoticeStatusPayload]>([
    'EatInOrder',
    'UpdateUserCourseMenuNoticeStatusPayload', // 通知を既読にした後にキャッシュを更新するため指定。
  ]);
  const [result] = useGetWebEatInHomeSectionsQuery({
    variables: {
      facilityID: facilityId,
      orderType: orderType,
    },
    // キャッシュの速度は欲しいが、カートを表示する都合上最新のデータも欲しいため cache-and-network
    requestPolicy: 'cache-and-network',
    context,
  });
  const { data, fetching, error } = result;
  useLoadingOverlay(fetching);
  if (error) {
    throw error;
  }
  if (!fetching && !data) {
    throw new NotFoundError();
  }

  if (!data) {
    return null;
  }

  return <EatInHomeView data={data} />;
};

const EatInHomeView = ({ data }: { data: GetWebEatInHomeSectionsQuery }) => {
  const { tenant, viewer, facility } = data;

  if (!facility || !isFacility(facility)) {
    throw new Error('店舗情報を取得できませんでした。');
  }

  // 店舗の設定がON、かつテーブルが選択されている場合にテーブルオーダーの支払いアイコンを表示する
  const showTableOrderPayment = facility.featureFlags.OnlinePaymentEnabled && viewer.table != null;
  const menuCategories = data.tenant.layout.webHome?.sections.find(
    (section) => section.__typename === "MenuCategoriesSection"
  )?.categories || [];

  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeSubcategory, setActiveSubcategory] = useState<{
    tabIndex: number;
    subIndex: number | null;
  }>({ tabIndex: 0, subIndex: null });

  const leftText =
  activeCategoryIndex > 0
    ? menuCategories[activeCategoryIndex - 1]?.name
    : menuCategories[0]?.name || "";

const rightText =
  activeCategoryIndex < menuCategories.length - 1
    ? menuCategories[activeCategoryIndex + 1]?.name
    : menuCategories[menuCategories.length - 1]?.name || "";

  
  return (
    <FeatureFlagsProvider featureFlags={facility.featureFlags}>     
        
        {tenant.layout.webHome?.sections.map((section, i) => (
          <React.Fragment key={i}>           
            
            {section.__typename === 'FacilityInfoSection' && (
              <>
              <VStack key={i} p="12px" w="full" align="stretch" borderBottom="1px solid" borderColor="mono.divider">
                <HomeEatInFacilityInfoSection section={section} table={viewer?.table || null} />                
              </VStack>
              <TabTest/>
              {menuCategories.length > 0 && (
                <TabMenu 
                  categoriesData={menuCategories}
                  setActiveCategoryIndex={setActiveCategoryIndex}
                  activeCategoryIndex={activeCategoryIndex}
                  setActiveSubcategory={setActiveSubcategory}
                  activeSubcategory={activeSubcategory}
                />
              )}
              </>
            )}
            
            {isObjectType<StatusSection>(section, 'StatusSection') && (
              <Box mt="40px" mx={containerMarginX} key={i}>
                <SuspendedBanner title={section.title} />
              </Box>
            )}            
            {isObjectType<HomeMenuCategoriesSectionPartsFragment>(section, 'MenuCategoriesSection') && (
              <Box>
                <HomeMenuCategoriesSection menuCategoriesSection={section} orderType={orderType} />
                <FooterNavigation leftText={leftText} rightText={rightText} onLeftClick={() => setActiveCategoryIndex((prev) => Math.max(prev - 1, 0))}
                onRightClick={() => setActiveCategoryIndex((prev) => Math.min(prev + 1, menuCategories.length - 1))}/>
              </Box>
            )}
            
          </React.Fragment>
        ))}
        <Spacer mb="40px" />        
        <FixedCartFooterButton
          orderType={orderType}
          cart={viewer?.cart}
          isTableOrder={!!data.viewer.table}
          cartRawIdForWatch={data?.viewer?.table?.cartRawId}
        />
      
    </FeatureFlagsProvider>
  );
};

const MotionTab = motion(Tab);

// const categories = [
//   { label: "パスタ",  subcategories: ["OIL", "MEAT", "JAPANESE TASTE", "TOMATO", "ROASTED"] },
//   { label: "肉料理",  subcategories: ["GRILLED", "FRIED", "ROASTED"] },
//   { label: "ドルチェ", subcategories: ["CAKES", "PIES", "ICE CREAM"] },
//   { label: "キッズ", subcategories: ["MEALS", "SNACKS"] },
//   { label: "プレ",  subcategories: ["SPECIAL DISH", "WINE PAIRINGS"] },
//   { label: "肉料理",  subcategories: ["GRILLED", "FRIED", "ROASTED"] },
//   { label: "ドルチェ",  subcategories: ["CAKES", "PIES", "ICE CREAM"] },
//   { label: "キッズ",  subcategories: ["MEALS", "SNACKS"] },
// ];

export const TabMenu = ({
  categoriesData,
  setActiveCategoryIndex,
  activeCategoryIndex,
  setActiveSubcategory,
  activeSubcategory,
}: {
  categoriesData: {
    name: string;
    items?: {
      nodes: { name: string }[];
    };
  }[];
  setActiveCategoryIndex: (index: number) => void;
  activeCategoryIndex: number;
  setActiveSubcategory: (subcategory: { tabIndex: number; subIndex: number | null }) => void;
  activeSubcategory: { tabIndex: number; subIndex: number | null };
}) => {
  if (!categoriesData || categoriesData.length === 0) return null;

  return (
    <Box position="sticky" top="0" zIndex="10" bg="white">
      <Tabs index={activeCategoryIndex}
        onChange={(index) => {
          setActiveCategoryIndex(index);
          setActiveSubcategory({ tabIndex: index, subIndex: null });
        }}>

        <Box
          overflowX="auto"
          whiteSpace="nowrap"
          css={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <TabList display="inline-flex" gap={0}>
            {categoriesData.map((category, index) => (
              <MotionTab
                key={index}
                as="div"
                _selected={{
                  bg: "brand.primary",
                  color: "white",
                  position: "relative",
                  "::after": {
                    content: `""`,
                    position: "absolute",
                    bottom: "-6px",
                    left: "50%",                    
                    width: "0",
                    height: "0",
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    borderTop: "6px solid white",
                  },
                }}
                className="bold-small"
                color="mono.primary"
              >
                {category.name}
              </MotionTab>
            ))}
          </TabList>
        </Box>

        {/* Subcategory Panels */}
        <TabPanels borderBottom="1px solid" borderColor="mono.divider">
          {categoriesData.map((category, tabIndex) => (
            <TabPanel key={tabIndex} p="0px">
              <Box
                overflowX="auto"
                whiteSpace="nowrap"
                p="8px"
                gap="8px"
                css={{
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                {category.items?.nodes.length > 0 ? (
                  category.items.nodes.map((menuItem, subIndex) => (
                    <Button
                      key={subIndex}
                      borderRadius="full"
                      bg={
                        activeSubcategory.tabIndex === tabIndex &&
                        activeSubcategory.subIndex === subIndex
                          ? "brand.primary"
                          : "mono.backGround"
                      }
                      color={
                        activeSubcategory.tabIndex === tabIndex &&
                        activeSubcategory.subIndex === subIndex
                          ? "white"
                          : "mono.primary"
                      }
                      size="md"
                      mr="8px"
                      px="18px"
                      py="8px"
                      onClick={() => setActiveSubcategory({ tabIndex, subIndex })}
                    >
                      {menuItem.name}
                    </Button>
                  ))
                ) : (
                  <Text color="gray.500">サブカテゴリがありません</Text>
                )}
              </Box>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default EatInHome;
