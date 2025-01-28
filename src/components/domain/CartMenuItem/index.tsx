import React, { FC, useCallback, useEffect, useState } from 'react';

import { OrderType } from '@/graphql/generated/types';
import { SwipeableBottomModal } from '@/components/ui/SwipeableBottomModalDialog';

import { OrderItemOptionItemsText } from '../OrderItemOptionItemsText';
import { CartOrderItem } from '../Cart/CartOrderItem';
import { CartOrderItemActions } from '../Cart/CartOrderItemActions';
import { MenuItemDetailModalContent } from '../MenuItemDetailMoalContent';

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
  const handleOnclickDelete = () => {
    if (!onClickDelete) return;
    onClickDelete(item.id);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = ''; // クリーンアップ
    };
  }, [isModalOpen]);

  return (
    <>
      <CartOrderItemActions onClickEdit={openModal} onClickDelete={handleOnclickDelete} />
      <SwipeableBottomModal
        isOpen={isModalOpen && !!item.menuItem.id}
        onClose={closeModal}
        title={item.menuItem.name || ''}
        footer={null}
      >
        {item.menuItem.id && (
          <MenuItemDetailModalContent
            menuItemId={item.menuItem.id}
            orderType={orderType}
            orderItemId={item.id}
            closeModal={closeModal}
          />
        )}
      </SwipeableBottomModal>
    </>
  );
};
