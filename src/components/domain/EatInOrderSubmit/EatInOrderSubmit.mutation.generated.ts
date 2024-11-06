import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SubmitEatInOrderMutationVariables = Types.Exact<{
  input: Types.SubmitOrderInput;
}>;

export type SubmitEatInOrderMutation = {
  __typename: 'Mutation';
  submitOrder: {
    __typename: 'SubmitOrderPayload';
    clientMutationId?: string | null;
    order:
      | { __typename: 'DeliveryOrder' }
      | { __typename: 'EatInOrder' }
      | { __typename: 'TableOrder' }
      | { __typename: 'TakeoutOrder' };
  };
};

export type SubmitSeatNumberOnOrderSubmitMutationVariables = Types.Exact<{
  input: Types.SetSeatNumberInput;
}>;

export type SubmitSeatNumberOnOrderSubmitMutation = {
  __typename: 'Mutation';
  setSeatNumber: {
    __typename: 'SetSeatNumberPayload';
    cart: {
      __typename: 'Cart';
      order?:
        | { __typename: 'DeliveryOrder' }
        | { __typename: 'EatInOrder' }
        | { __typename: 'TableOrder' }
        | { __typename: 'TakeoutOrder' }
        | null;
    };
  };
};

export const SubmitEatInOrderDocument = gql`
  mutation SubmitEatInOrder($input: SubmitOrderInput!) {
    submitOrder(input: $input) {
      clientMutationId
      order {
        __typename
      }
    }
  }
`;

export function useSubmitEatInOrderMutation() {
  return Urql.useMutation<SubmitEatInOrderMutation, SubmitEatInOrderMutationVariables>(SubmitEatInOrderDocument);
}
export const SubmitSeatNumberOnOrderSubmitDocument = gql`
  mutation SubmitSeatNumberOnOrderSubmit($input: SetSeatNumberInput!) {
    setSeatNumber(input: $input) {
      cart {
        order {
          __typename
        }
      }
    }
  }
`;

export function useSubmitSeatNumberOnOrderSubmitMutation() {
  return Urql.useMutation<SubmitSeatNumberOnOrderSubmitMutation, SubmitSeatNumberOnOrderSubmitMutationVariables>(
    SubmitSeatNumberOnOrderSubmitDocument,
  );
}
