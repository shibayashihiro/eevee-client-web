import { Box, VStack } from '@chakra-ui/react';

import { InsideNavbar } from '@/components/ui/InsideNavbar';
import { NextPageWithLayout } from '@/types';
import { useFacilityId, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { ChargeDetailsFullList } from '@/components/domain/ChargeDetailsFullList';
import { eatInHome, searchItemPage } from '@/utils/paths/facilityPages';
import { TableNumberMainHeader } from '@/components/domain/TableNumberMainHeader';
import { WithFeatureFlagsProvider } from '@/providers/FeatureFlagsProvider/WithFeatureFlagsProvider';
import { isFacility } from '@/graphql/helper';
import { isItemSearchMethodItemCodeForm } from '@/utils/localstorage/item_search_method';
import { OrderType } from '@/graphql/generated/types';
import { useGetTecAlignmentQuery } from '@/components/domain/TecAlignment/TecAlignment.query.generated';

import { OrderList } from './OrderList';
import { useTableOrdersPageQueryQuery } from './TableOrdersPage.query.generated';

export const TableOrdersPage: NextPageWithLayout = () => {
  const router = useTenantRouter();

  const facilityId = useFacilityId();
  const [tecAlignmentResult] = useGetTecAlignmentQuery();
  const tecAlignment = tecAlignmentResult.data?.tenant.tecAlignment;

  const [result] = useTableOrdersPageQueryQuery({
    variables: {
      facilityID: facilityId,
    },
    // 画面を開くたびに、最新の注文状況も取得したいため、キャッシュを使わないようにする
    requestPolicy: 'network-only',
  });
  const { data, fetching, error } = result;
  useLoadingOverlay(fetching);
  if (error) {
    throw error;
  }

  const showPriceExcludingTax =
    data?.facility && isFacility(data.facility) && data.facility.featureFlags.showPriceExcludingTax === true;

  return (
    <>
      <InsideNavbar
        title="注文履歴"
        onClickBackIcon={async () => {
          const isCodeSearchSelected = isItemSearchMethodItemCodeForm();
          if (isCodeSearchSelected) {
            await router.push(searchItemPage(facilityId, OrderType.EatIn));
          } else {
            await router.push(eatInHome(facilityId));
          }
        }}
      />
      <WithFeatureFlagsProvider facility={data?.facility}>
        {data?.viewer?.table && (
          <Box pb="54px">
            <TableNumberMainHeader table={data.viewer.table} />
            <VStack align="start" px="20px" py="24px" spacing="32px">
              <OrderList orderList={data.viewer.table} />
              {!(
                showPriceExcludingTax && tecAlignment
              ) /* TEC連携がONでかつ税抜き表示する場合は、端数ずれを感じさせないように小計合計等を表示しない。 */ &&
                data.viewer.table.charge && <ChargeDetailsFullList charge={data.viewer.table.charge} />}
            </VStack>
          </Box>
        )}
      </WithFeatureFlagsProvider>
    </>
  );
};
