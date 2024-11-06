import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UpdateDefaultPaymentMutationVariables = Types.Exact<{
  input: Types.UpdateDefaultPaymentInput;
}>;

export type UpdateDefaultPaymentMutation = {
  __typename: 'Mutation';
  updateDefaultPayment: { __typename: 'UpdateDefaultPaymentPayload'; payment: { __typename: 'Payment' } };
};

export type RemovePaymentMutationVariables = Types.Exact<{
  input: Types.RemovePaymentInput;
}>;

export type RemovePaymentMutation = {
  __typename: 'Mutation';
  removePayment: { __typename: 'RemovePaymentPayload'; payment: { __typename: 'Payment' } };
};

export const UpdateDefaultPaymentDocument = gql`
  mutation updateDefaultPayment($input: UpdateDefaultPaymentInput!) {
    updateDefaultPayment(input: $input) {
      payment {
        __typename
      }
    }
  }
`;

export function useUpdateDefaultPaymentMutation() {
  return Urql.useMutation<UpdateDefaultPaymentMutation, UpdateDefaultPaymentMutationVariables>(
    UpdateDefaultPaymentDocument,
  );
}
export const RemovePaymentDocument = gql`
  mutation removePayment($input: RemovePaymentInput!) {
    removePayment(input: $input) {
      payment {
        __typename
      }
    }
  }
`;

export function useRemovePaymentMutation() {
  return Urql.useMutation<RemovePaymentMutation, RemovePaymentMutationVariables>(RemovePaymentDocument);
}
