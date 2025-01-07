import React from 'react';

import { MenuItemDetail } from '@/components/domain/MenuItemDetail';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import { OrderType } from '@/graphql/generated/types';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';

import { useGetMenuItemDetailModalContentQuery } from './MenuItemDetailModalContent.query.generated';

type MenuItemDetailModalContentProps = {
  menuItemId: string;
  orderType: OrderType;
};

export const MenuItemDetailModalContent = ({ menuItemId, orderType }: MenuItemDetailModalContentProps) => {
  const facilityId = useFacilityId();

  const [result] = useGetMenuItemDetailModalContentQuery({
    variables: {
      facilityID: facilityId,
      menuItemID: menuItemId,
      orderType,
      withOrderItem: false,
      isEatIn: orderType === OrderType.EatIn,
      orderItemID: '', 
    },
    pause: !menuItemId,
  });

  const { data, error, fetching } = result;
  useLoadingOverlay(fetching);

  if (fetching) {
    return <LoadingSpinner/>;
  }

  if (error) {
    throw error;
  }

  if (!data || !data.menuItem || data.menuItem.__typename !== 'MenuItem') {
    throw new Error('not found');
  }

  const { menuItem, viewer } = data;

  return (    
      <MenuItemDetail
        menuItem={menuItem}
        cartId={viewer.cart.id}
        orderType={orderType}
        hasDeliveryAddress={viewer.deliveryAddresses.length > 0}
        initialOrderItem={viewer.cart.item}
        backTo={undefined} 
      />    
  );
};
