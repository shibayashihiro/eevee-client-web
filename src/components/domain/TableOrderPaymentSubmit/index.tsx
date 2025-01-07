import React, { FC, useCallback } from 'react';

import { generateMutationId } from '@/graphql/helper';
import { useHandleErrorWithAlertDialog, useShowAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useConfirmCardPayment } from '@/utils/stripe/useConfirmCardPayment';
import { localizedMessages } from '@/utils/errors';

import { FixedPaymentSubmitButton } from '../FixedPaymentSubmitButton';

import { useSubmitTableOrderPaymentMutation } from './TableOrderPaymentSubmit.mutation.generated';

type Props = {
  orderId: string;
  amount: number;
  disabled: boolean;
  onAfterTableOrderPaymentSubmitted: () => void;
};

export const TableOrderPaymentSubmit: FC<Props> = ({
  orderId,
  amount,
  disabled,
  onAfterTableOrderPaymentSubmitted,
}) => {
  const [_, completeTableOrder] = useSubmitTableOrderPaymentMutation();
  const { confirmCardPayment } = useConfirmCardPayment();

  const { showAlertDialog } = useShowAlertDialog();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const handleSubmit = useCallback(async () => {
    const { data, error } = await completeTableOrder({
      input: {
        clientMutationId: generateMutationId(),
        orderId: orderId,
        amount: amount,
      },
    });
    if (error) {
      handleErrorWithAlertDialog(error);
      return;
    }

    if (data?.checkoutTableOrder.paymentIntent) {
      const intentResult = await confirmCardPayment(data.checkoutTableOrder.paymentIntent);
      if (intentResult?.error) {
        showAlertDialog(intentResult?.error.message ?? new Error(localizedMessages.APIGeneralError).message);
        return;
      }
    }

    onAfterTableOrderPaymentSubmitted();
  }, [
    completeTableOrder,
    onAfterTableOrderPaymentSubmitted,
    handleErrorWithAlertDialog,
    confirmCardPayment,
    showAlertDialog,
    orderId,
    amount,
  ]);

  return <FixedPaymentSubmitButton onSubmit={handleSubmit} disabled={disabled} />;
};
