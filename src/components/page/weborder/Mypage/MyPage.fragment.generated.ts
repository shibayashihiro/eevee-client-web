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

import { MyPageStampCardFragmentDoc } from './MyPageStampCard.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetMyPageQueryVariables = Types.Exact<{
  facilityID: Types.Scalars['ID']['input'];
  first?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
  isAvailable?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
}>;

export type GetMyPageQuery = {
  __typename: 'Query';
  viewing: { __typename: 'Tenant'; logo: string };
  viewer: {
    __typename: 'User';
    loyaltyCard?: {
      __typename: 'UserLoyaltyCard';
      currentRank: { __typename: 'LoyaltyCardRank'; name: string; colorRGB: string };
      activeStampCards: Array<{
        __typename: 'StampCard';
        currentPoints: number;
        maxPointPerPage: number;
        reward: string;
      }>;
    } | null;
    coupons: { __typename: 'CouponConnection'; nodes: Array<{ __typename: 'Coupon'; id: string }> };
    membershipCard: { __typename: 'MembershipCard'; membershipQRCodeData: string };
    profile?: { __typename: 'Profile'; imageUrl: string } | null;
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

export const GetMyPageDocument = gql`
  query GetMyPage($facilityID: ID!, $first: Int, $after: String, $isAvailable: Boolean) {
    viewing {
      ...NavbarViewingParts
    }
    viewer {
      loyaltyCard {
        ...MyPageStampCard
      }
      coupons(first: $first, after: $after, isAvailable: $isAvailable) {
        nodes {
          id
        }
      }
      membershipCard(facilityID: $facilityID) {
        membershipQRCodeData
      }
      ...NavbarViewerParts
    }
    facility: node(id: $facilityID) {
      ...NavbarMenuFacility
    }
  }
  ${NavbarViewingPartsFragmentDoc}
  ${MyPageStampCardFragmentDoc}
  ${NavbarViewerPartsFragmentDoc}
  ${NavbarMenuViewerFragmentDoc}
  ${NavbarMenuFacilityFragmentDoc}
  ${FeatureFlagsForProviderFragmentDoc}
`;

export function useGetMyPageQuery(options: Omit<Urql.UseQueryArgs<GetMyPageQueryVariables>, 'query'>) {
  return Urql.useQuery<GetMyPageQuery, GetMyPageQueryVariables>({ query: GetMyPageDocument, ...options });
}
