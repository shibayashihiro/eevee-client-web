// eslint-disable-next-line no-restricted-imports
import { useStripe } from '@stripe/react-stripe-js';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { PaymentIntentStatus } from '@/graphql/generated/types';

import { PaymentIntentForConfirmCardPaymentFragment } from './useConfirmCardPayment.fragment.generated';

// PaymentIntentの支払いステータスを確認する
// 決済処理後は必ずこちらの関数を実行すること。
export const useConfirmCardPayment = () => {
  const [isReady, setIsReady] = useState(false);
  const stripe = useStripe();

  useEffect(() => {
    if (stripe) {
      setIsReady(true);
    }
  }, [stripe]);

  const confirmCardPayment = useCallback(
    async (intent: PaymentIntentForConfirmCardPaymentFragment) => {
      if (!stripe) {
        throw new Error('Stripe is not initialized');
      }
      // TODO: 3Dセキュアがキャンセルされた場合はキャンセル処理等考慮が必要そう
      if (intent.status !== PaymentIntentStatus.RequiresAction || !intent.clientSecret) {
        return;
      }
      return await stripe.confirmCardPayment(intent.clientSecret);
    },
    [stripe],
  );

  return useMemo(
    () => ({
      isReady,
      confirmCardPayment,
    }),
    [confirmCardPayment, isReady],
  );
};
