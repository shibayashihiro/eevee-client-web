import React, { FC, useCallback } from 'react';

import { useSubmitDeliveryOrderMutation } from '@/components/domain/DeliveryOrderSubmit/DeliveryOrderSubmit.mutation.generated';
import { generateMutationId } from '@/graphql/helper';
import { useHandleErrorWithAlertDialog, useShowAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { localizedMessages } from '@/utils/errors';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { useConfirmCardPayment } from '@/utils/stripe/useConfirmCardPayment';

import { FixedOrderSubmitButton } from '../FixedOrderSubmitButton';

type Props = {
  orderId: string;
  disabled: boolean;
  onAfterOrderSubmitted: () => void;
};

export const DeliveryOrderSubmit: FC<Props> = ({ orderId, disabled, onAfterOrderSubmitted }) => {
  const [result, submitOrder] = useSubmitDeliveryOrderMutation();
  const { isReady, confirmCardPayment } = useConfirmCardPayment();

  const { showAlertDialog } = useShowAlertDialog();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const handleSubmit = useCallback(async () => {
    const { data, error } = await submitOrder({
      input: {
        clientMutationId: generateMutationId(),
        orderId,
      },
    });
    if (error) {
      handleErrorWithAlertDialog(error);
      return;
    }

    if (data?.submitOrder.paymentIntent) {
      const intentResult = await confirmCardPayment(data.submitOrder.paymentIntent);
      if (intentResult?.error) {
        showAlertDialog(intentResult?.error.message ?? new Error(localizedMessages.APIGeneralError).message);
        return;
      }
    }

    onAfterOrderSubmitted();
  }, [confirmCardPayment, handleErrorWithAlertDialog, onAfterOrderSubmitted, orderId, showAlertDialog, submitOrder]);

  const { fetching } = result;
  useLoadingOverlay(fetching || !isReady);
  return (
    <>
      <FixedOrderSubmitButton onSubmit={handleSubmit} disabled={disabled} />
    </>
  );
};
