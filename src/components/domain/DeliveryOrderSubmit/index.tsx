import React, { FC, useCallback } from 'react';

import { useSubmitDeliveryOrderMutation } from '@/components/domain/DeliveryOrderSubmit/DeliveryOrderSubmit.mutation.generated';
import { generateMutationId } from '@/graphql/helper';
import { useHandleErrorWithAlertDialog, useShowAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { localizedMessages } from '@/utils/errors';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { useConfirmCardPayment } from '@/utils/stripe/useConfirmCardPayment';

import { FixedOrderSubmitButton } from '../FixedOrderSubmitButton';
import { hasError, useCartUserInfoFormState } from '../CartUserInfoForm/provider';

type Props = {
  orderId: string;
  ageVerified: boolean;
  submitLabel?: string;
  onAfterOrderSubmitted: () => void;
};

export const DeliveryOrderSubmit: FC<Props> = ({ orderId, ageVerified, submitLabel, onAfterOrderSubmitted }) => {
  const [result, submitOrder] = useSubmitDeliveryOrderMutation();
  const { isReady, confirmCardPayment } = useConfirmCardPayment();

  const userInfo = useCartUserInfoFormState();
  const { familyNameKana } = userInfo;

  const { showAlertDialog } = useShowAlertDialog();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const canSubmit = !hasError(userInfo) && ageVerified;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) {
      return;
    }
    const { data, error } = await submitOrder({
      input: {
        clientMutationId: generateMutationId(),
        orderId,
        lastNameKana: familyNameKana,
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
  }, [
    canSubmit,
    submitOrder,
    orderId,
    familyNameKana,
    onAfterOrderSubmitted,
    handleErrorWithAlertDialog,
    confirmCardPayment,
    showAlertDialog,
  ]);

  const { fetching } = result;
  useLoadingOverlay(fetching || !isReady);
  return (
    <>
      <FixedOrderSubmitButton onSubmit={handleSubmit} submitLabel={submitLabel} disabled={!canSubmit} />
    </>
  );
};
