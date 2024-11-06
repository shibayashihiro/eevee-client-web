import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { useHandleErrorWithAlertDialog, useShowAlertDialog } from '@/providers/tenant/GlobalModalDialogProvider/hooks';
import { useGlobalLoadingSpinnerDispatch } from '@/providers/GlobalLoadingSpinnerProvider';
import { useConfirmCardPayment } from '@/utils/stripe/useConfirmCardPayment';
import { localizedMessages } from '@/utils/errors';

import { UserSubscriptionPlanForRegistrationCompletedFragment } from './SubscriptionRegistrationCompleted.fragment.generated';
import { useSubmitSubscribeMutation } from './SubscriptionRegistration.mutation.generated';

type RegistrationProcessContextValue = {
  currentStep: SubscriptionRegistrationStep;
  clearStep: () => void;
  submitting: boolean;
  submitSubscribe: (planId: string) => Promise<void>;
};

const SubscriptionRegistrationProcessContext = createContext<RegistrationProcessContextValue | null>(null);

export const useSubscriptionRegistrationProcessContext = () => {
  const context = useContext(SubscriptionRegistrationProcessContext);
  if (!context) {
    throw new Error(
      'useSubscriptionRegistrationProcessContext must be used within SubscriptionRegistrationProcessProvider',
    );
  }
  return context;
};

type SubscriptionRegistrationStep = StepRegistration | StepCompleted;
type StepRegistration = {
  step: 'registration';
};

type StepCompleted = {
  step: 'completed';
  subscribedPlan: UserSubscriptionPlanForRegistrationCompletedFragment;
};

type Props = {
  children: ReactNode;
};

const initialStep = { step: 'registration' } as const;

export const SubscriptionRegistrationProcessProvider = ({ children }: Props) => {
  const [step, setStep] = useState<SubscriptionRegistrationStep>(initialStep);
  const [{ fetching: submitting }, submitSubscribe] = useSubmitSubscribeMutation();
  const { isReady, confirmCardPayment } = useConfirmCardPayment();

  const setLoading = useGlobalLoadingSpinnerDispatch();
  const { showAlertDialog } = useShowAlertDialog();
  const { handleErrorWithAlertDialog } = useHandleErrorWithAlertDialog();

  const handleSubmit = useCallback(
    async (planId: string) => {
      if (!isReady) {
        throw new Error('恐れ入りますが、しばらくしてから再度お試しください。');
      }
      setLoading(true);
      const { data, error } = await submitSubscribe({
        input: {
          planId,
        },
      });
      setLoading(false);
      if (error) {
        handleErrorWithAlertDialog(error);
        return;
      }
      if (!data) {
        throw new Error('internal error');
      }

      // TODO: 3Dセキュアがキャンセルされた場合はキャンセル処理等考慮が必要そう
      const intentResult = await confirmCardPayment(data.subscribe.paymentIntent);
      if (intentResult?.error) {
        showAlertDialog(intentResult?.error.message ?? new Error(localizedMessages.APIGeneralError).message);
        return;
      }

      setStep({ step: 'completed', subscribedPlan: data?.subscribe.subscription.currentPlan });
    },
    [confirmCardPayment, handleErrorWithAlertDialog, isReady, setLoading, showAlertDialog, submitSubscribe],
  );

  const clearStep = useCallback(() => {
    setStep(initialStep);
  }, []);

  const contextValue = useMemo(
    () => ({ currentStep: step, clearStep, submitting, submitSubscribe: handleSubmit }),
    [clearStep, handleSubmit, step, submitting],
  );

  return (
    <SubscriptionRegistrationProcessContext.Provider value={contextValue}>
      {children}
    </SubscriptionRegistrationProcessContext.Provider>
  );
};
