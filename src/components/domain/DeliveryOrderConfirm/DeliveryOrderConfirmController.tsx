import { FC, useCallback } from 'react';
import { UseQueryState } from 'urql';

import { isCart } from '@/graphql/helper';
import { GetCartForDeliveryOrderConfirmQuery } from '@/components/domain/DeliveryOrderConfirm/DeliveryOrderConfirm.query.generated';
import { useFacilityId, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { deliveryHome } from '@/utils/paths/facilityPages';

type Props = {
  queryResult: UseQueryState<GetCartForDeliveryOrderConfirmQuery>;
};

/**
 * deprecated: use useBackHomeIfOrderEmpty hook instead
 */
export const DeliveryOrderConfirmController: FC<Props> = ({ queryResult }) => {
  const facilityId = useFacilityId();

  const handleNothingOrderItems = useHandleNothingOrderItems(queryResult);
  const backTo = deliveryHome(facilityId);

  handleNothingOrderItems(backTo);
  return null;
};

export const useHandleNothingOrderItems = (queryResult: UseQueryState<GetCartForDeliveryOrderConfirmQuery>) => {
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
