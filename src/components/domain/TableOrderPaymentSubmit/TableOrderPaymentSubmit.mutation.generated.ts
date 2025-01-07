import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
import { PaymentIntentForConfirmCardPaymentFragmentDoc } from '../../../utils/stripe/useConfirmCardPayment.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SubmitTableOrderPaymentMutationVariables = Types.Exact<{
  input: Types.CheckoutTableOrderInput;
}>;

export type SubmitTableOrderPaymentMutation = {
  __typename: 'Mutation';
  checkoutTableOrder: {
    __typename: 'CheckoutTableOrderPayload';
    clientMutationId?: string | null;
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

export const SubmitTableOrderPaymentDocument = gql`
  mutation SubmitTableOrderPayment($input: CheckoutTableOrderInput!) {
    checkoutTableOrder(input: $input) {
      clientMutationId
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

export function useSubmitTableOrderPaymentMutation() {
  return Urql.useMutation<SubmitTableOrderPaymentMutation, SubmitTableOrderPaymentMutationVariables>(
    SubmitTableOrderPaymentDocument,
  );
}
