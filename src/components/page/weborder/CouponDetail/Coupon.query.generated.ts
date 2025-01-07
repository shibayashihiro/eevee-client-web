import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetCouponByIdQueryVariables = Types.Exact<{
  couponId: Types.Scalars['ID']['input'];
}>;

export type GetCouponByIdQuery = {
  __typename: 'Query';
  Coupon?:
    | { __typename: 'Cart' }
    | {
        __typename: 'Coupon';
        id: string;
        title: string;
        subTitle: string;
        image: string;
        statusLabel: string;
        canManualUse: boolean;
        details: Array<{ __typename: 'CouponDetail'; name: string; value: string }>;
      }
    | { __typename: 'CourseMenu' }
    | { __typename: 'CourseMenuCategory' }
    | { __typename: 'DeliveryOrder' }
    | { __typename: 'EatInOrder' }
    | { __typename: 'Facility' }
    | { __typename: 'MenuCategory' }
    | { __typename: 'MenuItem' }
    | { __typename: 'Survey' }
    | { __typename: 'Table' }
    | { __typename: 'TableOrder' }
    | { __typename: 'TakeoutOrder' }
    | { __typename: 'Tenant' }
    | { __typename: 'User' }
    | null;
};

export const GetCouponByIdDocument = gql`
  query GetCouponById($couponId: ID!) {
    Coupon: node(id: $couponId) {
      __typename
      ... on Coupon {
        id
        title
        subTitle
        image
        statusLabel
        details {
          name
          value
        }
        canManualUse
      }
    }
  }
`;

export function useGetCouponByIdQuery(options: Omit<Urql.UseQueryArgs<GetCouponByIdQueryVariables>, 'query'>) {
  return Urql.useQuery<GetCouponByIdQuery, GetCouponByIdQueryVariables>({ query: GetCouponByIdDocument, ...options });
}
