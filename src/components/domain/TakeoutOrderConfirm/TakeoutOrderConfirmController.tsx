import { FC, useCallback } from 'react';
import { UseQueryState } from 'urql';

import { isCart } from '@/graphql/helper';
import { useFacilityId, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { takeoutHome } from '@/utils/paths/facilityPages';
import { GetCartForTakeoutOrderConfirmQuery } from '@/components/domain/TakeoutOrderConfirm/TakeoutOrderConfirm.query.generated';

type Props = {
  queryResult: UseQueryState<GetCartForTakeoutOrderConfirmQuery>;
};

/**
 * deprecated: use useBackHomeIfOrderEmpty hook instead
 */
export const TakeoutOrderConfirmController: FC<Props> = ({ queryResult }) => {
  const facilityId = useFacilityId();

  const handleNothingOrderItems = useHandleNothingOrderItems(queryResult);
  const backTo = takeoutHome(facilityId);

  handleNothingOrderItems(backTo);
  return null;
};

export const useHandleNothingOrderItems = (queryResult: UseQueryState<GetCartForTakeoutOrderConfirmQuery>) => {
  const router = useTenantRouter();

  const handleNothingOrderItems = useCallback(
    (backTo: string) => {
      const { data, fetching, error } = queryResult;
      if (fetching || error) {
        return;
      }
      if (!data || !data.viewer.cart || !isCart(data.viewer.cart)) {
        return;
      }
      if (data.viewer.cart.totalQuantity == 0) {
        router.replace(backTo);
      }
    },
    [queryResult, router],
  );

  return handleNothingOrderItems;
};
