import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UpdateDisposableItemMutationVariables = Types.Exact<{
  input: Types.UpdateDisposableItemInput;
}>;

export type UpdateDisposableItemMutation = {
  __typename: 'Mutation';
  updateDisposableItem: { __typename: 'UpdateDisposableItemPayload'; cart: { __typename: 'Cart' } };
};

export const UpdateDisposableItemDocument = gql`
  mutation UpdateDisposableItem($input: UpdateDisposableItemInput!) {
    updateDisposableItem(input: $input) {
      cart {
        __typename
      }
    }
  }
`;

export function useUpdateDisposableItemMutation() {
  return Urql.useMutation<UpdateDisposableItemMutation, UpdateDisposableItemMutationVariables>(
    UpdateDisposableItemDocument,
  );
}
