import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SelectCouponMutationVariables = Types.Exact<{
  input: Types.SelectCouponInput;
}>;

export type SelectCouponMutation = {
  __typename: 'Mutation';
  selectCoupon: { __typename: 'SelectCouponPayload'; cart: { __typename: 'Cart' } };
};

export const SelectCouponDocument = gql`
  mutation selectCoupon($input: SelectCouponInput!) {
    selectCoupon(input: $input) {
      cart {
        __typename
      }
    }
  }
`;

export function useSelectCouponMutation() {
  return Urql.useMutation<SelectCouponMutation, SelectCouponMutationVariables>(SelectCouponDocument);
}
