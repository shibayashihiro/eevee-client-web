import { Box, Image, Spacer } from '@chakra-ui/react';
import React from 'react';

import { DeliveryAddressIndicator } from '@/components/domain/DeliveryAddressIndicator';
import { FixedCartFooterButton } from '@/components/domain/FixedCartFooterButton';
import { HomeDeliveryOutOfAreaBanner } from '@/components/domain/HomeDeliveryOutOfAreaBanner';
import { HomeDeliveryScheduledTimeSection } from '@/components/domain/HomeDeliveryScheduledTimeSection';
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
import {
  GetWebDeliveryHomeSectionsQuery,
  useGetWebDeliveryHomeSectionsQuery,
} from '@/components/page/weborder/DeliveryHome/DeliveryHome.query.generated';
import { SuspendedBanner } from '@/components/ui/SuspendedBanner';
import {
  DeliveryAddress,
  DeliveryOrder,
  DeliverySection,
  InProgressOrderSection,
  MainVisualSection,
  MembershipCardSection,
  OrderType,
  StatusSection,
} from '@/graphql/generated/types';
import { isFacility, isObjectType, useAdditionalTypeNamesContext } from '@/graphql/helper';
import { FeatureFlagsProvider } from '@/providers/FeatureFlagsProvider';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import { NextPageWithLayout } from '@/types';
import { containerMarginX } from '@/utils/constants';
import { NotFoundError } from '@/utils/errors';
import { ItemSearchMethodButtonType } from '@/components/domain/Navbar/NavbarMenu';

const orderType = OrderType.Delivery;

const DeliveryHome: NextPageWithLayout = () => {
  const facilityId = useFacilityId();

  // DeliveryOrder は、OrderのMutation(注文実行)後にもキャッシュを更新してほしいため指定
  const context = useAdditionalTypeNamesContext<[DeliveryAddress, DeliveryOrder]>(['DeliveryAddress', 'DeliveryOrder']);
  const [result] = useGetWebDeliveryHomeSectionsQuery({
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

  return <DeliveryHomeView data={data} />;
};

const DeliveryHomeView = ({ data }: { data: GetWebDeliveryHomeSectionsQuery }) => {
  const { tenant, viewer, facility } = data;
  const usingDeliveryAddress = viewer?.deliveryAddresses.find((f) => f.isUsing);

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
              <HomeFacilityInfoSection
                facilityInfoSection={section}
                orderType={orderType}
                usingDeliveryAddressLatLng={usingDeliveryAddress?.latLng}
              />
            </Box>
          )}
          {isObjectType<SelectOrderTypeSectionPartsFragment>(section, 'SelectOrderTypeSection') && (
            <Box mt="40px" mx={containerMarginX} key={i}>
              <SelectOrderTypeSection fragment={section} initialOrderType={OrderType.Delivery} />
            </Box>
          )}
          {isObjectType<DeliverySection>(section, 'DeliverySection') && (
            <Box mt="40px" mx={containerMarginX} key={i}>
              <DeliveryAddressIndicator fragment={viewer?.deliveryAddresses} />
              {section.isOutOfArea && <HomeDeliveryOutOfAreaBanner fragment={usingDeliveryAddress} />}
              {!section.isOutOfArea && <HomeDeliveryScheduledTimeSection fragment={section} />}
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
            <Box mt="40px" mx={containerMarginX} key={i}>
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

export default DeliveryHome;
