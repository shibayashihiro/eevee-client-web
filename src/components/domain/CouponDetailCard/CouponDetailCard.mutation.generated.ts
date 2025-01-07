import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SubmitUseCouponMutationVariables = Types.Exact<{
  input: Types.UseCouponInput;
}>;

export type SubmitUseCouponMutation = { __typename: 'Mutation'; useCoupon: { __typename: 'Coupon' } };

export const SubmitUseCouponDocument = gql`
  mutation submitUseCoupon($input: UseCouponInput!) {
    useCoupon(input: $input) {
      __typename
    }
  }
`;

export function useSubmitUseCouponMutation() {
  return Urql.useMutation<SubmitUseCouponMutation, SubmitUseCouponMutationVariables>(SubmitUseCouponDocument);
}
