import { Box, Spacer, VStack } from '@chakra-ui/react';
import React from 'react';

import { FixedCartFooterButton } from '@/components/domain/FixedCartFooterButton';
import { SuspendedBanner } from '@/components/ui/SuspendedBanner';
import {
  EatInOrder,
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
import { TabTest } from '@/components/domain/TabTest';
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

  return (
    <FeatureFlagsProvider featureFlags={facility.featureFlags}>
      {tenant.layout.webHome?.sections.map((section, i) => (
        <React.Fragment key={i}>
          {section.__typename === 'FacilityInfoSection' && (
            <>
              <VStack key={i} p="12px" w="full" align="stretch" borderBottom="1px solid" borderColor="mono.divider">
                <HomeEatInFacilityInfoSection section={section} table={viewer?.table || null} />
              </VStack>
              <TabTest orderType={orderType} />
            </>
          )}

          {isObjectType<StatusSection>(section, 'StatusSection') && (
            <Box mt="40px" mx={containerMarginX} key={i}>
              <SuspendedBanner title={section.title} />
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
