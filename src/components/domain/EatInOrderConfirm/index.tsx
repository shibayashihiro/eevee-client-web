import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Box } from '@chakra-ui/react';

import { isCart, isEatInOrder as isEatInOrderType, isFacility } from '@/graphql/helper';
import { localizedMessages } from '@/utils/errors';
import { CartTopBanner } from '@/components/domain/CartTopBanner/CartTopBanner';
import { OrderItem, OrderType } from '@/graphql/generated/types';
import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { SeatNumberInput } from '@/components/ui/SeatNumberInput';
import { OrderConfirmCart } from '@/components/domain/OrderConfirmCart';
import { useGetCartForEatInOrderConfirmQuery } from '@/components/domain/EatInOrderConfirm/EatInOrderConfirm.query.generated';
import { AgeVerificationCheckbox } from '@/components/domain/AgeVerificationCheckbox';
import { useFacilityId } from '@/providers/tenant/WebOrderPageStateProvider';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { useBackHomeIfOrderEmpty } from '@/hooks/domain/useBackHomeIfCartEmpty/useBackHomeIfCartEmpty';
import { WithFeatureFlagsProvider } from '@/providers/FeatureFlagsProvider/WithFeatureFlagsProvider';

import { EatInOrderSubmit } from '../EatInOrderSubmit';
import { CartFacilityName } from '../CartFacilityName';

import { useSaveSeatNumberOnRouteChange } from './useSaveSeatNumberOnRouteChange';

type Props = {
  onAfterOrderSubmitted: (orderItems: OrderItem[]) => void;
};

export const EatInOrderConfirm: FC<Props> = ({ onAfterOrderSubmitted }) => {
  const [seatNumber, setSeatNumber] = useState('');
  const [ageVerified, setAgeVerified] = useState(false);

  const facilityId = useFacilityId();

  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const [result] = useGetCartForEatInOrderConfirmQuery({
    variables: {
      facilityID: facilityId,
      orderType: OrderType.EatIn,
    },
    // 注文確認画面では注文の不整合を防ぐために厳密に最新データを取得したいため network-only
    requestPolicy: 'network-only',
  });
  useBackHomeIfOrderEmpty({
    cart: result.data?.viewer.cart,
    orderType: OrderType.EatIn,
    isError: !!result.error,
    isLoading: result.fetching,
  });
  const { data, fetching, error } = result;
  const cart = data?.viewer.cart;
  const order = cart?.order;

  useEffect(() => {
    if (data?.viewer.cart.order && isEatInOrderType(data.viewer.cart.order)) {
      setSeatNumber(data.viewer.cart.order.seatNumber ?? '');
    }
  }, [data?.viewer.cart.order]);

  const cartIsReady = !!cart && isCart(cart);
  const isEatInOrder = cartIsReady && !!order && isEatInOrderType(order);
  const ageVerificationRequired = order?.items.map((item) => item.menuItem.alcoholicBeverage).includes(true);

  const canSubmitOrder = useMemo(() => {
    if (!order) return false;
    if (!isEatInOrder) return false;
    if (seatNumber.length == 0) return false;
    if (ageVerificationRequired && !ageVerified) return false;
    return true;
  }, [ageVerificationRequired, ageVerified, isEatInOrder, order, seatNumber.length]);

  if (error) {
    handleErrorWithAlertDialog(error);
  }
  if (!fetching && (!data || !cart)) {
    handleErrorWithAlertDialog(new Error(localizedMessages.NotFoundError));
  }

  const handleOnAfterOrderSubmitted = useCallback(() => {
    if (!cartIsReady || !isEatInOrder) {
      return;
    }
    onAfterOrderSubmitted(order.items);
  }, [cartIsReady, isEatInOrder, onAfterOrderSubmitted, order]);

  const { fetching: fetchingSubmitSeatNumber } = useSaveSeatNumberOnRouteChange({
    cartId: cart?.id,
    seatNumber,
  });

  useLoadingOverlay(fetching || fetchingSubmitSeatNumber);
  return (
    <WithFeatureFlagsProvider facility={data?.facility}>
      <CartTopBanner />
      {cartIsReady && (
        <Box mt="40px" mr="20px" ml="20px" mb="40px">
          {data?.facility && isFacility(data.facility) && (
            <CartFacilityName facility={data.facility} mt="40px" mb="32px" />
          )}

          <OrderConfirmCart cartId={cart.id} orderType={OrderType.EatIn} orderConfirmCartParts={cart} />

          {isEatInOrder && (
            <>
              <SeatNumberInput value={seatNumber} onChange={setSeatNumber} />
              {ageVerificationRequired && <AgeVerificationCheckbox onChange={setAgeVerified} />}
              <EatInOrderSubmit
                orderId={order.id}
                cartId={cart.id}
                seatNumber={seatNumber}
                onAfterOrderSubmitted={handleOnAfterOrderSubmitted}
                disabled={!canSubmitOrder}
              />
            </>
          )}
        </Box>
      )}
    </WithFeatureFlagsProvider>
  );
};
