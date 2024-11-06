import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
import {
  NavbarViewingPartsFragmentDoc,
  NavbarViewerPartsFragmentDoc,
} from '../../../domain/Navbar/Navbar.fragment.generated';
import {
  NavbarMenuViewerFragmentDoc,
  NavbarMenuFacilityFragmentDoc,
} from '../../../domain/Navbar/NavbarMenu.fragment.generated';
import { FeatureFlagsForProviderFragmentDoc } from '../../../../providers/FeatureFlagsProvider/FeatureFlagsProvider.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetMyCouponsQueryVariables = Types.Exact<{
  facilityID: Types.Scalars['ID']['input'];
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
        details: Array<{ __typename: 'CouponDetail'; name: string; value: string }>;
      }>;
      pageInfo: { __typename: 'PageInfo'; hasNextPage: boolean; endCursor?: string | null };
    };
    profile?: { __typename: 'Profile'; imageUrl: string } | null;
    loyaltyCard?: { __typename: 'UserLoyaltyCard' } | null;
  };
  facility?:
    | { __typename: 'Cart' }
    | { __typename: 'Coupon' }
    | { __typename: 'CourseMenu' }
    | { __typename: 'CourseMenuCategory' }
    | { __typename: 'DeliveryOrder' }
    | { __typename: 'EatInOrder' }
    | {
        __typename: 'Facility';
        featureFlags: {
          __typename: 'FeatureFlags';
          showPriceExcludingTax: boolean;
          loyaltyProgramEnabled: boolean;
          itemCodeSearchEnabled: boolean;
        };
      }
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

export const GetMyCouponsDocument = gql`
  query GetMyCoupons($facilityID: ID!, $first: Int, $after: String, $isAvailable: Boolean!) {
    viewing {
      ...NavbarViewingParts
    }
    viewer {
      coupons(first: $first, after: $after, isAvailable: $isAvailable) {
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
      ...NavbarViewerParts
    }
    facility: node(id: $facilityID) {
      ...NavbarMenuFacility
    }
  }
  ${NavbarViewingPartsFragmentDoc}
  ${NavbarViewerPartsFragmentDoc}
  ${NavbarMenuViewerFragmentDoc}
  ${NavbarMenuFacilityFragmentDoc}
  ${FeatureFlagsForProviderFragmentDoc}
`;

export function useGetMyCouponsQuery(options: Omit<Urql.UseQueryArgs<GetMyCouponsQueryVariables>, 'query'>) {
  return Urql.useQuery<GetMyCouponsQuery, GetMyCouponsQueryVariables>({ query: GetMyCouponsDocument, ...options });
}
