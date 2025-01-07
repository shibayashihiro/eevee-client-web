import React, { FC, useCallback } from 'react';
import liff from '@line/liff';

import { generateMutationId } from '@/graphql/helper';
import { useHandleErrorWithAlertDialog, useShowAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useLoadingOverlay } from '@/providers/GlobalLoadingSpinnerProvider';
import { useSubmitTakeoutOrderMutation } from '@/components/domain/TakeoutOrderSubmit/TakeoutOrderSubmit.mutation.generated';
import { toJpPhoneNumber } from '@/utils/formatUtils';
import { useConfirmCardPayment } from '@/utils/stripe/useConfirmCardPayment';
import { localizedMessages } from '@/utils/errors';
import { useAuthUser } from '@/auth/provider/AuthUserProvider';
import { useSignInRequiredDialog } from '@/hooks/domain/useSignInRequiredDialog';

import { FixedOrderSubmitButton } from '../FixedOrderSubmitButton';
import { OrderPrivacyPolicyAgreement } from '../OrderPrivacyPolicyAgreement';
import { hasError, useCartUserInfoFormState } from '../CartUserInfoForm/provider';

type Props = {
  orderId: string;
  ageVerified: boolean;
  isSignInRequired: boolean;
  onAfterOrderSubmitted: () => void;
};

export const TakeoutOrderSubmit: FC<Props> = ({ orderId, ageVerified, isSignInRequired, onAfterOrderSubmitted }) => {
  const { isAnonymous } = useAuthUser();
  const [result, submitOrder] = useSubmitTakeoutOrderMutation();
  const { isReady, confirmCardPayment } = useConfirmCardPayment();

  const userInfo = useCartUserInfoFormState();
  const { familyNameKana, phoneNumber, email } = userInfo;

  const { showAlertDialog } = useShowAlertDialog();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();
  const { renderDialog: renderSignInRequiredDialog, onOpen: openSignInRequiredDialog } = useSignInRequiredDialog();

  const canSubmit = !hasError(userInfo) && ageVerified;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) {
      return;
    }
    if (isSignInRequired && isAnonymous) {
      openSignInRequiredDialog('注文するにはログインが必要です');
      return;
    }
    const { data, error } = await submitOrder({
      input: {
        clientMutationId: generateMutationId(),
        lastNameKana: familyNameKana,
        phoneNumber: toJpPhoneNumber(phoneNumber),
        email,
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
    canSubmit,
    isSignInRequired,
    isAnonymous,
    submitOrder,
    familyNameKana,
    phoneNumber,
    email,
    orderId,
    onAfterOrderSubmitted,
    openSignInRequiredDialog,
    handleErrorWithAlertDialog,
    confirmCardPayment,
    showAlertDialog,
  ]);

  const { fetching } = result;
  useLoadingOverlay(fetching || !isReady);
  return (
    <>
      <OrderPrivacyPolicyAgreement />
      <FixedOrderSubmitButton onSubmit={handleSubmit} disabled={!canSubmit} />
      {renderSignInRequiredDialog()}
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
