import React, { FC, useCallback } from 'react';

import { OrderType } from '@/graphql/generated/types';
import { menuItemDetailPage } from '@/utils/paths/facilityPages';
import { useFacilityId, useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';

import { OrderItemOptionItemsText } from '../OrderItemOptionItemsText';
import { CartOrderItem } from '../Cart/CartOrderItem';
import { CartOrderItemActions } from '../Cart/CartOrderItemActions';

import { CartMenuItemFragment } from './CartMenuItem.fragment.generated';

export type Props = {
  item: CartMenuItemFragment;
  orderType: OrderType;
  onClickDelete?: (id: string) => void;
  readonly?: boolean;
};

// NOTE: CourseMenuもCartのItemとして扱うようになったので、商品に対する本ComponentをCartMenuItemとしている
export const CartMenuItem: FC<Props> = (props: Props) => {
  const { item, readonly } = props;
  return (
    <CartOrderItem
      itemName={item.menuItem?.name}
      quantity={item.quantity}
      price={item.totalPrice}
      orderType={props.orderType}
      options={<OrderItemOptionItemsText orderItem={item} />}
      actions={readonly ? null : <Actions {...props} />}
    />
  );
};

const Actions = ({ item, orderType, onClickDelete }: Props) => {
  const facilityId = useFacilityId();
  const handleOnclickDelete = () => {
    if (!onClickDelete) return;
    onClickDelete(item.id);
  };

  const router = useTenantRouter();
  const handleOnClickEdit = useCallback(() => {
    router.push(menuItemDetailPage(facilityId, item.menuItem.id, orderType, item.id));
  }, [facilityId, item.id, item.menuItem.id, orderType, router]);

  return <CartOrderItemActions onClickEdit={handleOnClickEdit} onClickDelete={handleOnclickDelete} />;
};
