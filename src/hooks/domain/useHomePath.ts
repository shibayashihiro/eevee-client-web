import { useMemo } from 'react';

import { OrderType } from '@/graphql/generated/types';
import { useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import { deliveryHome, takeoutHome, eatInHome } from '@/utils/paths/facilityPages';

// OrderTypeから、対応するHomeのリンクを解決して返す
export const useHomePath = (orderType: OrderType): string => {
  const facilityId = useFacilityId();
  const home = useMemo(() => {
    switch (orderType) {
      case OrderType.Delivery:
        return deliveryHome(facilityId);
      case OrderType.Takeout:
        return takeoutHome(facilityId);
      case OrderType.EatIn:
        return eatInHome(facilityId);
    }
  }, [facilityId, orderType]);
  return home;
};
