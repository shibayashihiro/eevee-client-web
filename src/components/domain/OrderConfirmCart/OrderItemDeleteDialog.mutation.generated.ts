import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RemoveOrderItemMutationVariables = Types.Exact<{
  input: Types.RemoveOrderItemFromCartInput;
}>;

export type RemoveOrderItemMutation = {
  __typename: 'Mutation';
  removeOrderItemFromCart: { __typename: 'RemoveOrderItemFromCartPayload'; cart: { __typename: 'Cart' } };
};

export const RemoveOrderItemDocument = gql`
  mutation RemoveOrderItem($input: RemoveOrderItemFromCartInput!) {
    removeOrderItemFromCart(input: $input) {
      cart {
        __typename
      }
    }
  }
`;

export function useRemoveOrderItemMutation() {
  return Urql.useMutation<RemoveOrderItemMutation, RemoveOrderItemMutationVariables>(RemoveOrderItemDocument);
}
