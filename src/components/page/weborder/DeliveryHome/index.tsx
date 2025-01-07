import { Box, Image, Spacer, VStack } from '@chakra-ui/react';
import React from 'react';
import { useRouter } from 'next/router';

import variables from '@/styles/variables.module.scss';
import { DeliveryAddressIndicator } from '@/components/domain/DeliveryAddressIndicator';
import { FixedCartFooterButton } from '@/components/domain/FixedCartFooterButton';
import { HomeDeliveryOutOfAreaBanner } from '@/components/domain/HomeDeliveryOutOfAreaBanner';
import { HomeDeliveryScheduledTimeSection } from '@/components/domain/HomeDeliveryScheduledTimeSection';
import { HomeInProgressOrderSection } from '@/components/domain/HomeInProgressOrderSection';
import { HomeMembershipCardSection } from '@/components/domain/HomeMembershipCardSection';
import {
  HomeMenuCategoriesSection,
  HomeMenuCategoriesSectionPartsFragment,
} from '@/components/domain/HomeMenuCategoriesSection';
import { HomeMenuItemsSection, HomeMenuItemsSectionPartsFragment } from '@/components/domain/HomeMenuItemsSection';
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
  ScheduledOrderTime,
  StatusSection,
} from '@/graphql/generated/types';
import { isFacility, isObjectType, useAdditionalTypeNamesContext } from '@/graphql/helper';
import { FeatureFlagsProvider } from '@/providers/FeatureFlagsProvider';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { useFacilityId, usePromotionEnabled } from '@/providers/tenant/WebOrderPageStateProvider';
import { NextPageWithLayout } from '@/types';
import { containerMarginX } from '@/utils/constants';
import { NotFoundError } from '@/utils/errors';
import { validateQueryTenantIdentifier } from '@/utils/validator';
import { apps } from '@/apps';
import { useAuthUser } from '@/auth/provider/AuthUserProvider';
import { HomeHeader } from '@/components/domain/HomeHeader';
import { ItemSearchMethodButtonType } from '@/components/domain/Navbar/types';
import { NavigationHeaderLayout } from '@/components/layouts/NavigationHeaderLayout';
import { HomeDeliveryFacilityInfoSection } from '@/components/domain/HomeFacilityInfoSection';

const orderType = OrderType.Delivery;

const DeliveryHome: NextPageWithLayout = () => {
  const facilityId = useFacilityId();

  // DeliveryOrder は、OrderのMutation(注文実行)後にもキャッシュを更新してほしいため指定
  const context = useAdditionalTypeNamesContext<[DeliveryAddress, DeliveryOrder, ScheduledOrderTime]>([
    'DeliveryAddress',
    'DeliveryOrder',
    'ScheduledOrderTime',
  ]);
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
  const { isAnonymous } = useAuthUser();
  const router = useRouter();
  const cfg = validateQueryTenantIdentifier(router.query) ? apps.getConfig(router.query.tenantIdentifier) : null;
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
        {cfg?.promotionEnabled && isAnonymous && (
          <HomeHeader viewer={viewer} containerMaxWidth={variables.containerMaxWidth} />
        )}
        {tenant.layout.webHome?.sections.map((section, i) => (
          <React.Fragment key={i}>
            <Box w="full" bg="white" mx="auto" maxW={variables.containerMaxWidth}>
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
              {!promotionEnabled && //中規模UIモードの場合は注文履歴機能があるため、店舗ホームでは表示しない
                isObjectType<InProgressOrderSection>(section, 'InProgressOrderSection') && (
                  <Box mt="40px" mx={containerMarginX} key={i}>
                    <HomeInProgressOrderSection fragment={section} />
                  </Box>
                )}
              {section.__typename === 'FacilityInfoSection' && (
                <Box mt="25px" mx={containerMarginX} key={i}>
                  <HomeDeliveryFacilityInfoSection section={section} />
                </Box>
              )}
              {isObjectType<DeliverySection>(section, 'DeliverySection') && (
                <VStack mt="16px" spacing="16px" mx={containerMarginX} key={i}>
                  <DeliveryAddressIndicator fragment={viewer?.deliveryAddresses} />
                  {section.isOutOfArea && <HomeDeliveryOutOfAreaBanner fragment={usingDeliveryAddress} />}
                  {!section.isOutOfArea && <HomeDeliveryScheduledTimeSection fragment={section} />}
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
                <Box mt="40px" key={i}>
                  <HomeMenuCategoriesSection menuCategoriesSection={section} orderType={orderType} />
                </Box>
              )}
            </Box>
          </React.Fragment>
        ))}
        <Spacer mb="40px" />
        <FixedCartFooterButton orderType={orderType} cart={viewer?.cart} />
      </NavigationHeaderLayout>
    </FeatureFlagsProvider>
  );
};

export default DeliveryHome;
