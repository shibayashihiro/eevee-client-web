import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type AddCouponMutationVariables = Types.Exact<{
  input: Types.AddCouponInput;
}>;

export type AddCouponMutation = {
  __typename: 'Mutation';
  addCoupon: { __typename: 'AddCouponPayload'; coupon: { __typename: 'Coupon' } };
};

export const AddCouponDocument = gql`
  mutation addCoupon($input: AddCouponInput!) {
    addCoupon(input: $input) {
      coupon {
        __typename
      }
    }
  }
`;

export function useAddCouponMutation() {
  return Urql.useMutation<AddCouponMutation, AddCouponMutationVariables>(AddCouponDocument);
}
