import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UpdateMemoMutationVariables = Types.Exact<{
  input: Types.UpdateMemoInput;
}>;

export type UpdateMemoMutation = {
  __typename: 'Mutation';
  updateMemo: { __typename: 'UpdateMemoPayload'; cart: { __typename: 'Cart' } };
};

export const UpdateMemoDocument = gql`
  mutation UpdateMemo($input: UpdateMemoInput!) {
    updateMemo(input: $input) {
      cart {
        __typename
      }
    }
  }
`;

export function useUpdateMemoMutation() {
  return Urql.useMutation<UpdateMemoMutation, UpdateMemoMutationVariables>(UpdateMemoDocument);
}
