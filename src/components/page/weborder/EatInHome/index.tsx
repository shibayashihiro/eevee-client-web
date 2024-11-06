import { Box, Image, Spacer, VStack } from '@chakra-ui/react';
import React from 'react';

import { FixedCartFooterButton } from '@/components/domain/FixedCartFooterButton';
import { HomeBannerSection } from '@/components/domain/HomeBannerSection';
import { HomeBannerSectionPartsFragment } from '@/components/domain/HomeBannerSection/HomeBannerSection.fragment.generated';
import { HomeCourseMenuCategoriesSection } from '@/components/domain/HomeCourseMenuCategoriesSection';
import { HomeCourseMenuCategoriesSectionFragment } from '@/components/domain/HomeCourseMenuCategoriesSection/HomeCourseMenuCategoriesSection.fragment.generated';
import {
  HomeFacilityInfoSection,
  HomeFacilityInfoSectionPartsFragment,
} from '@/components/domain/HomeFacilityInfoSection';
import { HomeLastOrderPassedBanner } from '@/components/domain/HomeLastOrderPassedBanner';
import { HomeMembershipCardSection } from '@/components/domain/HomeMembershipCardSection';
import {
  HomeMenuCategoriesSection,
  HomeMenuCategoriesSectionPartsFragment,
} from '@/components/domain/HomeMenuCategoriesSection';
import { HomeMenuItemsSection, HomeMenuItemsSectionPartsFragment } from '@/components/domain/HomeMenuItemsSection';
import { Navbar } from '@/components/domain/Navbar';
import { SelectOrderTypeSection } from '@/components/domain/SelectOrderTypeSection';
import { SelectOrderTypeSectionPartsFragment } from '@/components/domain/SelectOrderTypeSection/SelectOrderTypeSection.fragment.generated';
import { TableCourseMenuStatsHeader } from '@/components/domain/TableCourseMenuStatsHeader';
import { SuspendedBanner } from '@/components/ui/SuspendedBanner';
import { ItemSearchMethodButtonType } from '@/components/domain/Navbar/NavbarMenu';
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

import { GetWebEatInHomeSectionsQuery, useGetWebEatInHomeSectionsQuery } from './EatInHome.query.generated';

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
  return (
    <FeatureFlagsProvider featureFlags={facility.featureFlags}>
      <Navbar
        viewing={tenant}
        viewer={viewer}
        facility={facility}
        orderType={orderType}
        showOrderHistory={true}
        itemSearchMethodButtonType={
          facility?.featureFlags.itemCodeSearchEnabled
            ? ItemSearchMethodButtonType.ShowItemCodeForm
            : ItemSearchMethodButtonType.None
        }
      />
      {viewer?.table && <TableCourseMenuStatsHeader table={viewer?.table} />}
      {tenant.layout.webHome?.sections.map((section, i) => (
        <React.Fragment key={i}>
          {isObjectType<MainVisualSection>(section, 'MainVisualSection') && (
            <Image
              src={section.image}
              alt="メイン画像"
              h={{ base: '187px', md: '320px' }}
              w="100%"
              objectFit="cover"
              objectPosition={'50% 50%'}
            />
          )}
          {isObjectType<MembershipCardSection>(section, 'MembershipCardSection') && (
            <HomeMembershipCardSection membershipCardSection={section} key={i} />
          )}
          {isObjectType<HomeBannerSectionPartsFragment>(section, 'BannerSection') && section.banners.length > 0 && (
            <Box mt="16px">
              <HomeBannerSection bannerSection={section} />
            </Box>
          )}
          {isObjectType<HomeFacilityInfoSectionPartsFragment>(section, 'FacilityInfoSection') && (
            <VStack key={i} align="stretch" mt="32px" mx={containerMarginX} spacing="20px">
              <HomeFacilityInfoSection facilityInfoSection={section} table={viewer?.table} orderType={orderType} />
              {data.viewer.table?.mainCourseMenu && (
                // 本当はsectionにした方が良さそうだが、コースメニュー(食べ飲み放題)用途以外に抽象化できるイメージが現時点でなかったので、
                // 一旦ここで直接べた表示している
                <HomeLastOrderPassedBanner courseMenu={data.viewer.table?.mainCourseMenu} />
              )}
            </VStack>
          )}
          {isObjectType<SelectOrderTypeSectionPartsFragment>(section, 'SelectOrderTypeSection') && (
            <Box mt="40px" mx={containerMarginX} key={i}>
              <SelectOrderTypeSection fragment={section} initialOrderType={OrderType.EatIn} />
            </Box>
          )}
          {isObjectType<StatusSection>(section, 'StatusSection') && (
            <Box mt="40px" mx={containerMarginX} key={i}>
              <SuspendedBanner title={section.title} />
            </Box>
          )}
          {isObjectType<HomeMenuItemsSectionPartsFragment>(section, 'MenuItemsSection') && (
            <Box mt="40px" mx={containerMarginX} key={i}>
              <HomeMenuItemsSection menuItemsSection={section} orderType={orderType} />
            </Box>
          )}
          {isObjectType<HomeMenuCategoriesSectionPartsFragment>(section, 'MenuCategoriesSection') && (
            <Box mt="40px">
              <HomeMenuCategoriesSection menuCategoriesSection={section} orderType={orderType} />
            </Box>
          )}
          {isObjectType<HomeCourseMenuCategoriesSectionFragment>(section, 'CourseMenuCategoriesSection') && (
            <Box mt="24px">
              <HomeCourseMenuCategoriesSection courseMenuCategoriesSection={section} />
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

export default EatInHome;
