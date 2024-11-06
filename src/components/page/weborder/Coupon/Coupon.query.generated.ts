import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetCouponQueryVariables = Types.Exact<{
  cartID?: Types.InputMaybe<Types.Scalars['ID']['input']>;
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type GetCouponQuery = {
  __typename: 'Query';
  viewer: {
    __typename: 'User';
    coupons: {
      __typename: 'CouponConnection';
      nodes: Array<{
        __typename: 'Coupon';
        id: string;
        title: string;
        subTitle: string;
        statusLabel: string;
        image: string;
        details: Array<{ __typename: 'CouponDetail'; name: string; value: string }>;
      }>;
      pageInfo: { __typename: 'PageInfo'; hasNextPage: boolean; endCursor?: string | null };
    };
  };
};

export const GetCouponDocument = gql`
  query GetCoupon($cartID: ID, $after: String) {
    viewer {
      coupons(cartID: $cartID, after: $after) {
        nodes {
          id
          title
          subTitle
          statusLabel
          image
          details {
            name
            value
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export function useGetCouponQuery(options?: Omit<Urql.UseQueryArgs<GetCouponQueryVariables>, 'query'>) {
  return Urql.useQuery<GetCouponQuery, GetCouponQueryVariables>({ query: GetCouponDocument, ...options });
}
