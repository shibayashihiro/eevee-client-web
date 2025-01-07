import { VStack, Flex } from '@chakra-ui/react';
import liff from '@line/liff';

import { apps } from '@/apps';
import { isFacility } from '@/graphql/helper';
import { useFacilityId, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { NextPageWithLayout } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { NavigationHeaderLayout } from '@/components/layouts/NavigationHeaderLayout';
import { validateQueryTenantIdentifier } from '@/utils/validator';

import { MyPageStampCard } from './MyPageStampCard';
import { GetFacilityMyPageQuery, useGetFacilityMyPageQuery } from './FacilityMyPage.query.generated';
import { MyPageMembershipCard } from './MyPageMembershipCard';
import { MyPageMenu, useMyPageMenuQueryContext } from './MyPageMenu';

export const FacilityMyPage: NextPageWithLayout = () => {
  const facilityId = useFacilityId();
  const router = useTenantRouter();
  const isInLIFFClient = liff.isInClient();
  const cfg = validateQueryTenantIdentifier(router.query) ? apps.getConfig(router.query.tenantIdentifier) : null;
  const promotionEnabled = cfg?.promotionEnabled ?? false;

  const context = useMyPageMenuQueryContext();
  const [{ data, fetching, error }] = useGetFacilityMyPageQuery({
    variables: {
      facilityID: facilityId,
    },
    context,
  });

  if (fetching) return <LoadingSpinner />;
  if (error) throw error;
  if (!data || !data.facility || !isFacility(data.facility)) throw new Error('not found');

  return (
    <NavigationHeaderLayout viewing={data.viewing} viewer={data.viewer} facility={data.facility} disableHomeLink>
      <FacilityMyPageLayout
        viewer={data.viewer}
        viewing={data.viewing}
        isInClient={isInLIFFClient}
        promotionEnabled={promotionEnabled}
      />
    </NavigationHeaderLayout>
  );
};

const FacilityMyPageLayout = ({
  viewer,
  viewing,
}: {
  viewer: GetFacilityMyPageQuery['viewer'];
  viewing: GetFacilityMyPageQuery['viewing'];
  isInClient: boolean;
  promotionEnabled: boolean;
}) => {
  return (
    <Flex as="main" flexDirection="column" py="24px" align="stretch">
      {/* CRM用のセクションは、現状はLINEミニアプリの場合のみ表示する。
          現状、中規模UI以外ではログイン機能を提供しておらず、LINEミニアプリの場合しかユーザーを追跡できないため。 */}
      {liff.isInClient() && (
        <VStack align="stretch" spacing="32px" mb="32px" px="20px">
          <MyPageMembershipCard user={viewer} />
          <MyPageStampCard myPageStampCard={viewer} />
        </VStack>
      )}
      <MyPageMenu user={viewer} tenant={viewing} />
    </Flex>
  );
};
