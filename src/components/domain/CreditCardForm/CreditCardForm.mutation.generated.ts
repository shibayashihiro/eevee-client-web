import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AddPaymentMutationVariables = Types.Exact<{
  input: Types.AddPaymentInput;
}>;

export type AddPaymentMutation = {
  __typename: 'Mutation';
  addPayment: { __typename: 'AddPaymentPayload'; payment: { __typename: 'Payment' } };
};

export const AddPaymentDocument = gql`
  mutation addPayment($input: AddPaymentInput!) {
    addPayment(input: $input) {
      payment {
        __typename
      }
    }
  }
`;

export function useAddPaymentMutation() {
  return Urql.useMutation<AddPaymentMutation, AddPaymentMutationVariables>(AddPaymentDocument);
}
