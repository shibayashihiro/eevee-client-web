import React, { FC, useCallback, useState } from 'react';
import { ListItem, OrderedList, Spacer, VStack } from '@chakra-ui/react';

import { CouponItem } from '@/components/domain/CouponItem';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button';
import { containerMarginX } from '@/utils/constants';
import {
  useSelectCouponMutation,
  useSelectTableCouponMutation,
} from '@/components/domain/CouponList/CouponList.mutation.generated';
import { generateMutationId } from '@/graphql/helper';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';

import { CouponCardForListFragment } from '../CouponCard/CouponCard.fragment.generated';

type Props = {
  coupons: CouponCardForListFragment[];
  cartId?: string;
  isTableOrder?: boolean;
  selectedCouponId?: string | null;
};

export const CouponList: FC<Props> = ({ coupons, cartId, isTableOrder, selectedCouponId }: Props) => {
  const router = useTenantRouter();

  const [selectedItemId, setSelectedItemId] = useState<string | null | undefined>(selectedCouponId);
  const [cartResult, selectCoupon] = useSelectCouponMutation();
  const [orderResult, updateOrderCoupon] = useSelectTableCouponMutation();

  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const selectable = cartId != null || isTableOrder;

  const handleOnClickSelect = (id: string) => {
    if (selectedItemId) {
      setSelectedItemId(null);
      return;
    }
    setSelectedItemId(id);
  };

  const handleSubmit = useCallback(async () => {
    if (!selectable) return;

    let result;
    if (cartId) {
      result = await selectCoupon({
        input: {
          clientMutationId: generateMutationId(),
          couponId: selectedItemId,
          cartId: cartId,
        },
      });
    } else {
      result = await updateOrderCoupon({
        input: {
          clientMutationId: generateMutationId(),
          couponId: selectedItemId,
        },
      });
    }
    if (result.error) {
      handleErrorWithAlertDialog(result.error);
      return;
    }
    router.back();
  }, [selectable, cartId, router, selectCoupon, selectedItemId, updateOrderCoupon, handleErrorWithAlertDialog]);

  const fetching = cartResult.fetching || orderResult.fetching;
  useLoadingOverlay(fetching);
  return (
    <>
      <VStack mx={containerMarginX} mb="16px">
        <OrderedList styleType="none" w="full" ml={0}>
          {coupons.map((coupon, i) => (
            <ListItem pt="16px" key={i}>
              <CouponItem
                fragment={coupon}
                selected={coupon.id === selectedItemId}
                onClickSelect={handleOnClickSelect}
              />
            </ListItem>
          ))}
        </OrderedList>
        <Spacer mb="40px" />
        {selectable && selectedItemId && (
          <PrimaryButton h="56px" rounded="32px" onClick={handleSubmit}>
            このクーポンを利用する
          </PrimaryButton>
        )}
        {selectable && !selectedItemId && (
          <SecondaryButton h="56px" rounded="32px" onClick={handleSubmit}>
            クーポンを利用しない
          </SecondaryButton>
        )}
      </VStack>
    </>
  );
};
