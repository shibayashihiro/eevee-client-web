import React, { FC, useCallback, useState } from 'react';
import { ListItem, OrderedList, Spacer, VStack } from '@chakra-ui/react';

import { CouponItem } from '@/components/domain/CouponItem';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button';
import { containerMarginX } from '@/utils/constants';
import { useSelectCouponMutation } from '@/components/domain/CouponList/CouponList.mutation.generated';
import { generateMutationId } from '@/graphql/helper';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { Coupon } from '@/graphql/generated/types';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';

type Props = {
  coupons: Coupon[];
  cartId?: string;
  selectedCouponId?: string | null;
};

export const CouponList: FC<Props> = ({ coupons, cartId, selectedCouponId }: Props) => {
  const router = useTenantRouter();

  const [selectedItemId, setSelectedItemId] = useState<string | null | undefined>(selectedCouponId);
  const [result, selectCoupon] = useSelectCouponMutation();

  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const selectable = cartId != null;

  const handleOnClickSelect = (id: string) => {
    if (selectedItemId) {
      setSelectedItemId(null);
      return;
    }
    setSelectedItemId(id);
  };

  const handleSubmit = useCallback(async () => {
    if (!cartId) return;

    const { error } = await selectCoupon({
      input: {
        clientMutationId: generateMutationId(),
        couponId: selectedItemId,
        cartId: cartId,
      },
    });
    if (error) {
      handleErrorWithAlertDialog(error);
      return;
    }
    router.back();
  }, [cartId, handleErrorWithAlertDialog, router, selectCoupon, selectedItemId]);

  const { fetching } = result;
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
