import React, { FC, useCallback } from 'react';
import liff from '@line/liff';

import { generateMutationId } from '@/graphql/helper';
import { useHandleErrorWithAlertDialog, useShowAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { useSubmitTakeoutOrderMutation } from '@/components/domain/TakeoutOrderSubmit/TakeoutOrderSubmit.mutation.generated';
import { toJpPhoneNumber } from '@/utils/formatUtils';
import { useConfirmCardPayment } from '@/utils/stripe/useConfirmCardPayment';
import { localizedMessages } from '@/utils/errors';

import { FixedOrderSubmitButton } from '../FixedOrderSubmitButton';
import { OrderPrivacyPolicyAgreement } from '../OrderPrivacyPolicyAgreement';

type Props = {
  orderId: string;
  lastNameKana: string;
  phoneNumber: string;
  email: string;
  disabled: boolean;
  onAfterOrderSubmitted: () => void;
};

export const TakeoutOrderSubmit: FC<Props> = ({
  orderId,
  lastNameKana,
  phoneNumber,
  email,
  disabled,
  onAfterOrderSubmitted,
}) => {
  const [result, submitOrder] = useSubmitTakeoutOrderMutation();
  const { isReady, confirmCardPayment } = useConfirmCardPayment();

  const { showAlertDialog } = useShowAlertDialog();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const handleSubmit = useCallback(async () => {
    const { data, error } = await submitOrder({
      input: {
        clientMutationId: generateMutationId(),
        lastNameKana: lastNameKana,
        phoneNumber: toJpPhoneNumber(phoneNumber),
        email: email,
        orderId,
        liffAccessToken: getLINEToken(),
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
    submitOrder,
    lastNameKana,
    phoneNumber,
    email,
    orderId,
    onAfterOrderSubmitted,
    handleErrorWithAlertDialog,
    confirmCardPayment,
    showAlertDialog,
  ]);

  const { fetching } = result;
  useLoadingOverlay(fetching || !isReady);
  return (
    <>
      <OrderPrivacyPolicyAgreement />
      <FixedOrderSubmitButton onSubmit={handleSubmit} disabled={disabled} />
    </>
  );
};

const getLINEToken = () => {
  if (!liff.isInClient()) {
    return '';
  }
  const token = liff.getAccessToken();
  if (!token) {
    return '';
  }
  return token;
};
