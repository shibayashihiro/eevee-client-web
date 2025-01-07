import { useCallback } from 'react';

import { BottomSheetDrawer } from '@/components/ui/BottomSheetDrawer';
import { StripeProvider } from '@/utils/stripe/provider';

import { SubscriptionRegistration } from './SubscriptionRegistration';
import {
  SubscriptionForRegistrationProcessFragment,
  SubscriptionPlanForRegistrationProcessFragment,
  TenantForSubscriptionPlanRegistrationProcessFragment,
  UserForSubscriptionPlanRegistrationProcessFragment,
} from './SubscriptionRegistrationProcess.fragment.generated';
import { SubscriptionRegistrationCompleted } from './SubscriptionRegistrationCompleted';
import { SubscriptionRegistrationProcessProvider, useSubscriptionRegistrationProcessContext } from './Provider';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  subscription: SubscriptionForRegistrationProcessFragment;
  plan: SubscriptionPlanForRegistrationProcessFragment;
  user: UserForSubscriptionPlanRegistrationProcessFragment;
  tenant: TenantForSubscriptionPlanRegistrationProcessFragment;
};

export const SubscriptionRegistrationProcessBottomSheet = (props: Props) => {
  return (
    <StripeProvider>
      <SubscriptionRegistrationProcessProvider>
        <SubscriptionRegistrationProcessBottomSheetContent {...props} />
      </SubscriptionRegistrationProcessProvider>
    </StripeProvider>
  );
};

const SubscriptionRegistrationProcessBottomSheetContent = (props: Props) => {
  const { isOpen, onClose } = props;
  const { submitting, clearStep } = useSubscriptionRegistrationProcessContext();

  const handleOnClose = useCallback(() => {
    if (!submitting) {
      onClose();
    }
  }, [submitting, onClose]);

  return (
    <BottomSheetDrawer isOpen={isOpen} onClose={handleOnClose} onCloseComplete={clearStep}>
      <RegistrationStepper {...props} />
    </BottomSheetDrawer>
  );
};

const RegistrationStepper = (props: Props) => {
  const { currentStep } = useSubscriptionRegistrationProcessContext();

  switch (currentStep.step) {
    case 'registration':
      return <SubscriptionRegistration {...props} />;
    case 'completed':
      return (
        <SubscriptionRegistrationCompleted
          subscriptionTitle={props.subscription.title}
          completedPlan={currentStep.subscribedPlan}
          userName={props.user.profile?.displayName}
        />
      );
  }
};
