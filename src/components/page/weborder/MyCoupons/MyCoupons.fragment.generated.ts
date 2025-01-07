import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
import {
  NavbarViewingPartsFragmentDoc,
  NavbarViewerPartsFragmentDoc,
  NavbarMenuViewerFragmentDoc,
} from '../../../domain/Navbar/Navbar.fragment.generated';
import { CouponCardForListFragmentDoc } from '../../../domain/CouponCard/CouponCard.fragment.generated';
import { GeneralNavbarMenuViewerFragmentDoc } from '../../../domain/Navbar/GeneralNavbarMenu.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetMyCouponsQueryVariables = Types.Exact<{
  first?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
  isAvailable: Types.Scalars['Boolean']['input'];
}>;

export type GetMyCouponsQuery = {
  __typename: 'Query';
  viewing: { __typename: 'Tenant'; logo: string };
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
    profile?: { __typename: 'Profile'; imageUrl: string } | null;
    loyaltyCard?: { __typename: 'UserLoyaltyCard' } | null;
  };
};

export const GetMyCouponsDocument = gql`
  query GetMyCoupons($first: Int, $after: String, $isAvailable: Boolean!) {
    viewing {
      ...NavbarViewingParts
    }
    viewer {
      coupons(first: $first, after: $after, isAvailable: $isAvailable) {
        nodes {
          ...CouponCardForList
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
      ...NavbarViewerParts
    }
  }
  ${NavbarViewingPartsFragmentDoc}
  ${CouponCardForListFragmentDoc}
  ${NavbarViewerPartsFragmentDoc}
  ${NavbarMenuViewerFragmentDoc}
  ${GeneralNavbarMenuViewerFragmentDoc}
`;

export function useGetMyCouponsQuery(options: Omit<Urql.UseQueryArgs<GetMyCouponsQueryVariables>, 'query'>) {
  return Urql.useQuery<GetMyCouponsQuery, GetMyCouponsQueryVariables>({ query: GetMyCouponsDocument, ...options });
}
