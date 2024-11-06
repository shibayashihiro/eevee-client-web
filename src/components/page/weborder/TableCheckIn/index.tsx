import { ParsedUrlQuery } from 'querystring';

import { useCallback, useEffect } from 'react';

import { eatInHome, initialHome } from '@/utils/paths/facilityPages';
import { NextPageWithLayout } from '@/types';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { useTableCheckInPageQueryQuery } from '@/components/page/weborder/TableCheckIn/TableCheckIn.query.generated';
import { isFacility, isTable } from '@/graphql/helper';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { Navbar } from '@/components/domain/Navbar';
import { CustomerAttributeInput, OrderType } from '@/graphql/generated/types';
import { CustomerAttributeSelect } from '@/components/domain/CustomerAttributeSelect';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';

import { useCheckInTableMutation } from './TableCheckIn.mutation.generated';

type ExpectedQuery = {
  facilityId: string;
  tableId: string;
};

const isValidQuery = (query: ParsedUrlQuery): query is ExpectedQuery => {
  const { facilityId, tableId } = query;
  if (typeof facilityId !== 'string' || typeof tableId !== 'string') {
    return false;
  }
  return true;
};

const CheckInPage: NextPageWithLayout = () => {
  const router = useTenantRouter();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const orderType = OrderType.EatIn;
  const queryParams = router.query;
  if (!isValidQuery(queryParams)) {
    throw new Error('invalid url');
  }

  const [{ fetching: submitting }, checkInTable] = useCheckInTableMutation();
  const [result] = useTableCheckInPageQueryQuery({
    variables: {
      facilityId: queryParams.facilityId,
      tableId: queryParams.tableId,
    },
  });

  const { data, fetching, error } = result;
  useLoadingOverlay(submitting || fetching);
  if (error) {
    handleErrorWithAlertDialog(error);
  }
  const table = data?.table;

  const runCheckInTable = useCallback(
    async (customerAttributes: CustomerAttributeInput[]) => {
      if (!table) {
        return;
      }
      const { error } = await checkInTable({
        input: {
          facilityId: queryParams.facilityId,
          tableId: table.id,
          customerAttributes: customerAttributes,
        },
      });
      if (error) {
        throw error;
      }
      if (!data || !data.facility || !isFacility(data.facility)) {
        throw new Error('not found');
      }

      if (data.facility.featureFlags.itemCodeSearchEnabled) {
        await router.replace(initialHome(queryParams.facilityId, OrderType.EatIn));
      } else {
        await router.replace(eatInHome(queryParams.facilityId));
      }
    },
    [checkInTable, data, queryParams.facilityId, router, table],
  );

  const onSubmit = (customerAttributesMap: Map<string, number>) => {
    const customerAttributes: CustomerAttributeInput[] = [];
    customerAttributesMap.forEach((value, key) => {
      customerAttributes.push({
        customerAttributeDetailId: key,
        value: value,
      });
    });
    void runCheckInTable(customerAttributes);
  };

  useEffect(() => {
    if (fetching) {
      return;
    }
    if (table == null) {
      return;
    }
    // 客数を入力済みの場合は、チェックイン処理を行う
    if (table.isCustomerAttributesCollected) {
      void runCheckInTable([]);
    }
  }, [checkInTable, fetching, queryParams, router, router.isReady, runCheckInTable, table]);

  return (
    <>
      {data &&
        table &&
        isTable(table) &&
        data.facility &&
        isFacility(data.facility) &&
        !table.isCustomerAttributesCollected && (
          <>
            <Navbar viewing={data.viewing} viewer={data.viewer} facility={data.facility} orderType={orderType} />
            <CustomerAttributeSelect onSubmit={onSubmit} />
          </>
        )}
    </>
  );
};

export default CheckInPage;
