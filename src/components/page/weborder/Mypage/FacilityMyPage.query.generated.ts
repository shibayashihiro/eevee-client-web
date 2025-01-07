import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
import {
  NavbarViewingPartsFragmentDoc,
  NavbarViewerPartsFragmentDoc,
  NavbarMenuViewerFragmentDoc,
  NavbarMenuFacilityFragmentDoc,
} from '../../../domain/Navbar/Navbar.fragment.generated';
import {
  GeneralNavbarMenuViewerFragmentDoc,
  GeneralNavbarMenuFacilityFragmentDoc,
} from '../../../domain/Navbar/GeneralNavbarMenu.generated';
import { FeatureFlagsForProviderFragmentDoc } from '../../../../providers/FeatureFlagsProvider/FeatureFlagsProvider.fragment.generated';

import { TenantForMyPageMenuFragmentDoc, UserForMyPageMenuFragmentDoc } from './MyPageMenu.fragment.generated';
import { MyPageMembershipCardFragmentDoc } from './MyPageMembershipCard.fragment.generated';
import { MyPageStampCardFragmentDoc, MyPageActiveStampCardFragmentDoc } from './MyPageStampCard.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetFacilityMyPageQueryVariables = Types.Exact<{
  facilityID: Types.Scalars['ID']['input'];
}>;

export type GetFacilityMyPageQuery = {
  __typename: 'Query';
  viewing: {
    __typename: 'Tenant';
    logo: string;
    helpUrl: string;
    contactUrl: string;
    termsOfUseUrl: string;
    privacyPolicyUrl: string;
    specifiedCommercialTransactionActUrl: string;
  };
  viewer: {
    __typename: 'User';
    membershipCard: { __typename: 'MembershipCard'; membershipQRCodeData: string };
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
          OnlinePaymentEnabled: boolean;
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

export const GetFacilityMyPageDocument = gql`
  query GetFacilityMyPage($facilityID: ID!) {
    viewing {
      ...NavbarViewingParts
      ...TenantForMyPageMenu
    }
    viewer {
      ...NavbarViewerParts
      ...MyPageMembershipCard
      ...MyPageStampCard
      ...UserForMyPageMenu
    }
    facility: node(id: $facilityID) {
      ...NavbarMenuFacility
    }
  }
  ${NavbarViewingPartsFragmentDoc}
  ${TenantForMyPageMenuFragmentDoc}
  ${NavbarViewerPartsFragmentDoc}
  ${NavbarMenuViewerFragmentDoc}
  ${GeneralNavbarMenuViewerFragmentDoc}
  ${MyPageMembershipCardFragmentDoc}
  ${MyPageStampCardFragmentDoc}
  ${MyPageActiveStampCardFragmentDoc}
  ${UserForMyPageMenuFragmentDoc}
  ${NavbarMenuFacilityFragmentDoc}
  ${GeneralNavbarMenuFacilityFragmentDoc}
  ${FeatureFlagsForProviderFragmentDoc}
`;

export function useGetFacilityMyPageQuery(options: Omit<Urql.UseQueryArgs<GetFacilityMyPageQueryVariables>, 'query'>) {
  return Urql.useQuery<GetFacilityMyPageQuery, GetFacilityMyPageQueryVariables>({
    query: GetFacilityMyPageDocument,
    ...options,
  });
}
