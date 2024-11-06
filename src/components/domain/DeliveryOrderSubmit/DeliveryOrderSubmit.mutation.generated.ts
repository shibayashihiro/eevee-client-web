import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
import { PaymentIntentForConfirmCardPaymentFragmentDoc } from '../../../utils/stripe/useConfirmCardPayment.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SubmitDeliveryOrderMutationVariables = Types.Exact<{
  input: Types.SubmitOrderInput;
}>;

export type SubmitDeliveryOrderMutation = {
  __typename: 'Mutation';
  submitOrder: {
    __typename: 'SubmitOrderPayload';
    order:
      | { __typename: 'DeliveryOrder' }
      | { __typename: 'EatInOrder' }
      | { __typename: 'TableOrder' }
      | { __typename: 'TakeoutOrder' };
    paymentIntent?: {
      __typename: 'PaymentIntent';
      clientSecret?: string | null;
      status: Types.PaymentIntentStatus;
    } | null;
  };
};

export const SubmitDeliveryOrderDocument = gql`
  mutation SubmitDeliveryOrder($input: SubmitOrderInput!) {
    submitOrder(input: $input) {
      order {
        __typename
      }
      paymentIntent {
        ...PaymentIntentForConfirmCardPayment
      }
    }
  }
  ${PaymentIntentForConfirmCardPaymentFragmentDoc}
`;

export function useSubmitDeliveryOrderMutation() {
  return Urql.useMutation<SubmitDeliveryOrderMutation, SubmitDeliveryOrderMutationVariables>(
    SubmitDeliveryOrderDocument,
  );
}
