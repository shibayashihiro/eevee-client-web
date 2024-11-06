import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AddCartItemMutationVariables = Types.Exact<{
  input: Types.AddMenuItemToCartInput;
}>;

export type AddCartItemMutation = {
  __typename: 'Mutation';
  addMenuItemToCart: { __typename: 'AddMenuItemToCartPayload'; cart: { __typename: 'Cart' } };
};

export type UpdateCartItemMutationVariables = Types.Exact<{
  input: Types.ModifyOrderItemInput;
}>;

export type UpdateCartItemMutation = {
  __typename: 'Mutation';
  modifyOrderItem: { __typename: 'ModifyOrderItemPayload'; cart: { __typename: 'Cart' } };
};

export const AddCartItemDocument = gql`
  mutation AddCartItem($input: AddMenuItemToCartInput!) {
    addMenuItemToCart(input: $input) {
      cart {
        __typename
      }
    }
  }
`;

export function useAddCartItemMutation() {
  return Urql.useMutation<AddCartItemMutation, AddCartItemMutationVariables>(AddCartItemDocument);
}
export const UpdateCartItemDocument = gql`
  mutation UpdateCartItem($input: ModifyOrderItemInput!) {
    modifyOrderItem(input: $input) {
      cart {
        __typename
      }
    }
  }
`;

export function useUpdateCartItemMutation() {
  return Urql.useMutation<UpdateCartItemMutation, UpdateCartItemMutationVariables>(UpdateCartItemDocument);
}
