import React, { FormEvent, useState } from 'react';
// eslint-disable-next-line no-restricted-imports
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeCardElementChangeEvent } from '@stripe/stripe-js';

import { useHandleErrorWithAlertDialog, useShowAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { localizedMessages } from '@/utils/errors';
import { PrimaryButton } from '@/components/ui/Button';
import { generateMutationId } from '@/graphql/helper';
import { useAddPaymentMutation } from '@/components/domain/CreditCardForm/CreditCardForm.mutation.generated';
import { useTenantRouter } from '@/providers/tenant/WebOrderPageStateProvider';
import { useGlobalLoadingSpinnerDispatch } from '@/providers/GlobalLoadingSpinnerProvider';

export const StripeCreditCardForm = () => {
  const router = useTenantRouter();
  const setLoading = useGlobalLoadingSpinnerDispatch();
  const [, addPayment] = useAddPaymentMutation();
  const { showAlertDialog } = useShowAlertDialog();

  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const [complete, setComplete] = useState(false);

  const handleChangeCard = (e: StripeCardElementChangeEvent) => setComplete(e.complete);

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const element = elements.getElement(CardElement);
    if (!element) return;

    setLoading(true);
    try {
      const resultCreateToken = await stripe.createToken(element);
      if (resultCreateToken.error) {
        showAlertDialog(resultCreateToken.error.message ?? new Error(localizedMessages.APIGeneralError).message);
        return;
      }
      const { error } = await addPayment({
        input: {
          clientMutationId: generateMutationId(),
          token: resultCreateToken.token.id,
        },
      });
      if (error) {
        handleErrorWithAlertDialog(error);
        return;
      }
      router.back();
    } finally {
      setLoading(false);
    }
  };

  // TODO(ogiogi): スタイルの変更
  return (
    <>
      <form onSubmit={handleSubmit}>
        <CardElement
          onReady={() => setLoading(false)}
          onChange={handleChangeCard}
          options={{ style: elementStyles, hidePostalCode: true }}
        />
        <PrimaryButton h="56px" rounded="32px" type="submit" mt="40px" disabled={!complete}>
          追加する
        </PrimaryButton>
      </form>
    </>
  );
};

const elementStyles = {
  base: {
    color: '#32325d',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4',
    },
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a',
  },
};
