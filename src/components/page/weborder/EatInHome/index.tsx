import { Box, Image, Spacer, VStack } from '@chakra-ui/react';
import React from 'react';

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

  return (
    <FeatureFlagsProvider featureFlags={facility.featureFlags}>
      <NavigationHeaderLayout
        viewing={tenant}
        viewer={viewer}
        facility={facility}
        orderType={orderType}
        showOrderHistory={true}
        showTableOrderPayment={showTableOrderPayment}
        itemSearchMethodButtonType={
          facility?.featureFlags.itemCodeSearchEnabled
            ? ItemSearchMethodButtonType.ShowItemCodeForm
            : ItemSearchMethodButtonType.None
        }
      >
        {viewer?.table && <TableCourseMenuStatsHeader table={viewer?.table} />}
        {tenant.layout.webHome?.sections.map((section, i) => (
          <React.Fragment key={i}>
            {isObjectType<MainVisualSection>(section, 'MainVisualSection') && (
              <Image
                src={section.image}
                alt=""
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
            {section.__typename === 'FacilityInfoSection' && (
              <VStack key={i} align="stretch" mt="32px" mx={containerMarginX} spacing="20px">
                <HomeEatInFacilityInfoSection section={section} table={viewer?.table || null} />
                {data.viewer.table?.mainCourseMenu && (
                  // 本当はsectionにした方が良さそうだが、コースメニュー(食べ飲み放題)用途以外に抽象化できるイメージが現時点でなかったので、
                  // 一旦ここで直接べた表示している
                  <HomeLastOrderPassedBanner courseMenu={data.viewer.table?.mainCourseMenu} />
                )}
              </VStack>
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
                <HomeCourseMenuCategoriesSection courseMenuCategoriesSection={section} orderType={orderType} />
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
      </NavigationHeaderLayout>
    </FeatureFlagsProvider>
  );
};

export default EatInHome;
