import { useEffect } from 'react';

import { deliveryHome, eatInHome, takeoutHome } from '@/utils/paths/facilityPages';
import { useTenantRouter, useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import { OrderType } from '@/graphql/generated/types';

import { BackHomeIfCartEmptyPartsFragment } from './useBackHomeIfCartEmpty.generated';
type Props = {
  cart?: BackHomeIfCartEmptyPartsFragment;
  orderType: OrderType;
  // ロード中やエラーで空の場合はページ移動したくないので、その判定用に渡す
  isLoading: boolean;
  isError: boolean;
};

const resolveBackTo = (orderType: OrderType, facilityId: string) => {
  switch (orderType) {
    case OrderType.Delivery:
      return deliveryHome(facilityId);
    case OrderType.Takeout:
      return takeoutHome(facilityId);
    case OrderType.EatIn:
      return eatInHome(facilityId);
    default:
      return '/';
  }
};

export const useBackHomeIfOrderEmpty = ({ cart, orderType, isLoading, isError }: Props) => {
  const router = useTenantRouter();
  const facilityId = useFacilityId();
  const backTo = resolveBackTo(orderType, facilityId);

  useEffect(() => {
    if (isError || isLoading) {
      return;
    }
    if (!cart || cart.totalQuantity === 0) {
      router.replace(backTo);
    }
  }, [backTo, cart, isError, isLoading, router]);
};
