import React, { FC, useCallback, useEffect, useState } from 'react';

import { useHandleErrorWithAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { generateMutationId } from '@/graphql/helper';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';

import { FixedOrderSubmitButton } from '../FixedOrderSubmitButton';
import { OrderPrivacyPolicyAgreement } from '../OrderPrivacyPolicyAgreement';

import {
  useSubmitEatInOrderMutation,
  useSubmitSeatNumberOnOrderSubmitMutation,
} from './EatInOrderSubmit.mutation.generated';

type Props = {
  orderId: string;
  cartId: string;
  seatNumber: string;
  disabled: boolean;
  onAfterOrderSubmitted: () => void;
};

export const EatInOrderSubmit: FC<Props> = (props) => {
  const { disabled } = props;
  const { submitting, submitOrderWithSeatNumber } = useSubmitOrderAndSeatNumberMutation(props);

  useLoadingOverlay(submitting);

  const handleSubmit = useCallback(async () => {
    await submitOrderWithSeatNumber();
  }, [submitOrderWithSeatNumber]);

  return (
    <>
      <OrderPrivacyPolicyAgreement />
      <FixedOrderSubmitButton onSubmit={handleSubmit} disabled={disabled} />
    </>
  );
};

const useSubmitOrderAndSeatNumberMutation = ({
  orderId,
  cartId,
  seatNumber,
  onAfterOrderSubmitted,
}: Omit<Props, 'disabled'>) => {
  const [oldOrderIds, setOldOrderIds] = useState<string[]>([]);
  const [seatNumberSubmitted, setSeatNumberSubmitted] = useState(false);
  const [submitOrderResult, submitOrder] = useSubmitEatInOrderMutation();
  const [submitSeatNumberResult, submitSeatNumber] = useSubmitSeatNumberOnOrderSubmitMutation();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const pushOldOrderId = useCallback(
    (orderId: string) => {
      setOldOrderIds((oldOrderIds) => [...oldOrderIds, orderId]);
    },
    [setOldOrderIds],
  );

  /**
   * seatNumberをsubmitしてから、OrderをSubmitする
   */
  const submitOrderWithSeatNumber = useCallback(async (): Promise<void> => {
    pushOldOrderId(orderId); // この時点で参照しているOrderIdは古いということを保持しておく
    const seatNumberResult = await submitSeatNumber({
      input: {
        clientMutationId: generateMutationId(),
        cartId: cartId,
        seatNumber,
      },
    });
    if (seatNumberResult.error) {
      handleErrorWithAlertDialog(seatNumberResult.error);
    }
    setSeatNumberSubmitted(true);
  }, [cartId, handleErrorWithAlertDialog, orderId, pushOldOrderId, seatNumber, submitSeatNumber]);

  /**
   * SeatNumberがsubmitされたことを検知してOrderをsubmitする。
   * submitSeatNumberの後に一度レンダリングを挟んで最新のOrderIdを取得してこないといけないため
   * 気持ち悪い処理になっている。(TODO: APIがsubmitOrderと同時にseatNumberを送信できるようになると綺麗にできるので修正予定)
   */
  useEffect(() => {
    (async (): Promise<void> => {
      if (seatNumberSubmitted) {
        if (oldOrderIds.includes(orderId)) {
          return;
        }
        setSeatNumberSubmitted(false);
        const orderResult = await submitOrder({
          input: {
            clientMutationId: generateMutationId(),
            orderId,
          },
        });
        if (orderResult.error) {
          handleErrorWithAlertDialog(orderResult.error);
          return;
        }
        onAfterOrderSubmitted();
      }
    })();
  }, [seatNumberSubmitted, handleErrorWithAlertDialog, onAfterOrderSubmitted, orderId, submitOrder, oldOrderIds]);

  return {
    submitting: seatNumberSubmitted || submitOrderResult.fetching || submitSeatNumberResult.fetching,
    submitOrderWithSeatNumber,
  };
};
