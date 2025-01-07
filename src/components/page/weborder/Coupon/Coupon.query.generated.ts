import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
import { CouponCardForListFragmentDoc } from '../../../domain/CouponCard/CouponCard.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetCouponQueryVariables = Types.Exact<{
  cartID?: Types.InputMaybe<Types.Scalars['ID']['input']>;
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
  isAvailable?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
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
        canManualUse: boolean;
        details: Array<{ __typename: 'CouponDetail'; name: string; value: string }>;
      }>;
      pageInfo: { __typename: 'PageInfo'; hasNextPage: boolean; endCursor?: string | null };
    };
  };
};

export const GetCouponDocument = gql`
  query GetCoupon($cartID: ID, $after: String, $isAvailable: Boolean) {
    viewer {
      coupons(cartID: $cartID, after: $after, isAvailable: $isAvailable) {
        nodes {
          ...CouponCardForList
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  ${CouponCardForListFragmentDoc}
`;

export function useGetCouponQuery(options?: Omit<Urql.UseQueryArgs<GetCouponQueryVariables>, 'query'>) {
  return Urql.useQuery<GetCouponQuery, GetCouponQueryVariables>({ query: GetCouponDocument, ...options });
}
