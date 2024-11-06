import { Box, Image, Spacer } from '@chakra-ui/react';
import React from 'react';

import { FixedCartFooterButton } from '@/components/domain/FixedCartFooterButton';
import {
  HomeFacilityInfoSection,
  HomeFacilityInfoSectionPartsFragment,
} from '@/components/domain/HomeFacilityInfoSection';
import { HomeInProgressOrderSection } from '@/components/domain/HomeInProgressOrderSection';
import { HomeMembershipCardSection } from '@/components/domain/HomeMembershipCardSection';
import {
  HomeMenuCategoriesSection,
  HomeMenuCategoriesSectionPartsFragment,
} from '@/components/domain/HomeMenuCategoriesSection';
import { HomeMenuItemsSection, HomeMenuItemsSectionPartsFragment } from '@/components/domain/HomeMenuItemsSection';
import { Navbar } from '@/components/domain/Navbar';
import { SelectOrderTypeSection } from '@/components/domain/SelectOrderTypeSection';
import { SelectOrderTypeSectionPartsFragment } from '@/components/domain/SelectOrderTypeSection/SelectOrderTypeSection.fragment.generated';
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
import { useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import { NextPageWithLayout } from '@/types';
import { containerMarginX } from '@/utils/constants';
import { NotFoundError } from '@/utils/errors';
import { ItemSearchMethodButtonType } from '@/components/domain/Navbar/NavbarMenu';

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
      {tenant.layout.webHome?.sections.map((section, i) => (
        <React.Fragment key={i}>
          {isObjectType<MainVisualSection>(section, 'MainVisualSection') && (
            <Box key={i}>
              <Image
                src={section.image}
                alt="メイン画像"
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
          {isObjectType<InProgressOrderSection>(section, 'InProgressOrderSection') && (
            <Box mt="40px" mx={containerMarginX} key={i}>
              <HomeInProgressOrderSection fragment={section} />
            </Box>
          )}
          {isObjectType<HomeFacilityInfoSectionPartsFragment>(section, 'FacilityInfoSection') && (
            <Box mt="40px" mx={containerMarginX} key={i}>
              <HomeFacilityInfoSection facilityInfoSection={section} orderType={orderType} />
            </Box>
          )}
          {isObjectType<SelectOrderTypeSectionPartsFragment>(section, 'SelectOrderTypeSection') && (
            <Box mt="40px" mx={containerMarginX} key={i}>
              <SelectOrderTypeSection fragment={section} initialOrderType={OrderType.Takeout} />
            </Box>
          )}
          {isObjectType<TakeoutSection>(section, 'TakeoutSection') && (
            <Box mt="40px" mx={containerMarginX} key={i}>
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
    </FeatureFlagsProvider>
  );
};

export default TakeoutHome;
