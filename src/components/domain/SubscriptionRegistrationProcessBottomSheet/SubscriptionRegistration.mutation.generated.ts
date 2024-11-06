import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
import { PaymentIntentForConfirmCardPaymentFragmentDoc } from '../../../utils/stripe/useConfirmCardPayment.fragment.generated';

import { UserSubscriptionPlanForRegistrationCompletedFragmentDoc } from './SubscriptionRegistrationCompleted.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SubmitSubscribeMutationVariables = Types.Exact<{
  input: Types.SubscribeInput;
}>;

export type SubmitSubscribeMutation = {
  __typename: 'Mutation';
  subscribe: {
    __typename: 'SubscribePayload';
    subscription: {
      __typename: 'UserSubscription';
      currentPlan: {
        __typename: 'UserSubscriptionPlan';
        subscriptionMonth: number;
        plan: {
          __typename: 'SubscriptionPlan';
          title: string;
          benefits: Array<{ __typename: 'SubscriptionBenefit'; title: string }>;
        };
      };
    };
    paymentIntent: { __typename: 'PaymentIntent'; clientSecret?: string | null; status: Types.PaymentIntentStatus };
  };
};

export const SubmitSubscribeDocument = gql`
  mutation SubmitSubscribe($input: SubscribeInput!) {
    subscribe(input: $input) {
      subscription {
        currentPlan {
          ...UserSubscriptionPlanForRegistrationCompleted
        }
      }
      paymentIntent {
        ...PaymentIntentForConfirmCardPayment
      }
    }
  }
  ${UserSubscriptionPlanForRegistrationCompletedFragmentDoc}
  ${PaymentIntentForConfirmCardPaymentFragmentDoc}
`;

export function useSubmitSubscribeMutation() {
  return Urql.useMutation<SubmitSubscribeMutation, SubmitSubscribeMutationVariables>(SubmitSubscribeDocument);
}
