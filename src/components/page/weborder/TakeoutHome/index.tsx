import { Box, Image, Spacer } from '@chakra-ui/react';
import React from 'react';

import { FixedCartFooterButton } from '@/components/domain/FixedCartFooterButton';
import { HomeInProgressOrderSection } from '@/components/domain/HomeInProgressOrderSection';
import { HomeMembershipCardSection } from '@/components/domain/HomeMembershipCardSection';
import {
  HomeMenuCategoriesSection,
  HomeMenuCategoriesSectionPartsFragment,
} from '@/components/domain/HomeMenuCategoriesSection';
import { HomeMenuItemsSection, HomeMenuItemsSectionPartsFragment } from '@/components/domain/HomeMenuItemsSection';
import { HomeTakeoutSection } from '@/components/domain/HomeTakeoutSection';
import {
  GetWebTakeoutHomeSectionsQuery,
  useGetWebTakeoutHomeSectionsQuery,
} from '@/components/page/weborder/TakeoutHome/TakeoutHome.query.generated';
import { SuspendedBanner } from '@/components/ui/SuspendedBanner';
import {
  InProgressOrderSection,
  MainVisualSection,
  MembershipCardSection,
  OrderType,
  StatusSection,
  TakeoutOrder,
  TakeoutSection,
  ScheduledOrderTime,
} from '@/graphql/generated/types';
import { isFacility, isObjectType, useAdditionalTypeNamesContext } from '@/graphql/helper';
import { FeatureFlagsProvider } from '@/providers/FeatureFlagsProvider';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { useFacilityId, usePromotionEnabled } from '@/providers/tenant/WebOrderPageStateProvider';
import { NextPageWithLayout } from '@/types';
import { containerMarginX } from '@/utils/constants';
import { NotFoundError } from '@/utils/errors';
import { NavigationHeaderLayout } from '@/components/layouts/NavigationHeaderLayout';
import { ItemSearchMethodButtonType } from '@/components/domain/Navbar/types';
import { HomeTakeoutFacilityInfoSection } from '@/components/domain/HomeFacilityInfoSection/HomeTakeoutFacilityInfoSection';

const orderType = OrderType.Takeout;

export const TakeoutHome: NextPageWithLayout = () => {
  const facilityId = useFacilityId();

  const context = useAdditionalTypeNamesContext<[ScheduledOrderTime, TakeoutOrder]>([
    'ScheduledOrderTime',
    'TakeoutOrder',
  ]);
  const [result] = useGetWebTakeoutHomeSectionsQuery({
    variables: {
      facilityID: facilityId,
      orderType: orderType,
    },
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
  return <TakeoutHomeView data={data} />;
};

const TakeoutHomeView = ({ data }: { data: GetWebTakeoutHomeSectionsQuery }) => {
  const { tenant, viewer, facility } = data;
  const promotionEnabled = usePromotionEnabled();

  if (!facility || !isFacility(facility)) {
    throw new Error('店舗情報を取得できませんでした。');
  }
  return (
    <FeatureFlagsProvider featureFlags={facility.featureFlags}>
      <NavigationHeaderLayout
        viewing={tenant}
        viewer={viewer}
        facility={facility}
        orderType={orderType}
        showOrderHistory={true}
        showTableOrderPayment={false}
        itemSearchMethodButtonType={
          facility?.featureFlags.itemCodeSearchEnabled
            ? ItemSearchMethodButtonType.ShowItemCodeForm
            : ItemSearchMethodButtonType.None
        }
      >
        {tenant.layout.webHome?.sections.map((section, i) => (
          <React.Fragment key={i}>
            {isObjectType<MainVisualSection>(section, 'MainVisualSection') && (
              <Box key={i}>
                <Image
                  src={section.image}
                  alt=""
                  h={{ base: '187px', md: '320px' }}
                  w="100%"
                  objectFit="cover"
                  objectPosition={'50% 50%'}
                />
              </Box>
            )}
            {isObjectType<MembershipCardSection>(section, 'MembershipCardSection') && (
              <HomeMembershipCardSection membershipCardSection={section} key={i} />
            )}
            {!promotionEnabled && // 中規模UIモードの場合は注文履歴機能があるため、店舗ホームでは表示しない
              isObjectType<InProgressOrderSection>(section, 'InProgressOrderSection') && (
                <Box mt="40px" mx={containerMarginX} key={i}>
                  <HomeInProgressOrderSection fragment={section} />
                </Box>
              )}
            {section.__typename === 'FacilityInfoSection' && (
              <Box mt="25px" mx={containerMarginX} key={i}>
                <HomeTakeoutFacilityInfoSection section={section} />
              </Box>
            )}
            {isObjectType<TakeoutSection>(section, 'TakeoutSection') && (
              <Box mt="16px" mx={containerMarginX} key={i}>
                <HomeTakeoutSection fragment={section} />
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
              <Box mt="40px" key={i}>
                <HomeMenuCategoriesSection menuCategoriesSection={section} orderType={orderType} />
              </Box>
            )}
          </React.Fragment>
        ))}
        <Spacer mb="40px" />
        <FixedCartFooterButton orderType={orderType} cart={viewer?.cart} />
      </NavigationHeaderLayout>
    </FeatureFlagsProvider>
  );
};

export default TakeoutHome;
