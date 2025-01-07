import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
import {
  NavbarViewingPartsFragmentDoc,
  NavbarViewerPartsFragmentDoc,
  NavbarMenuViewerFragmentDoc,
} from '../../../domain/Navbar/Navbar.fragment.generated';
import { GeneralNavbarMenuViewerFragmentDoc } from '../../../domain/Navbar/GeneralNavbarMenu.generated';

import { TenantForMyPageMenuFragmentDoc, UserForMyPageMenuFragmentDoc } from './MyPageMenu.fragment.generated';
import { MyPageProfileHeaderFragmentDoc } from './ProfileHeader.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetTenantMyPageQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetTenantMyPageQuery = {
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
    profile?: { __typename: 'Profile'; lastNameKana?: string | null; imageUrl: string } | null;
    coupons: { __typename: 'CouponConnection'; nodes: Array<{ __typename: 'Coupon'; id: string }> };
    loyaltyCard?: { __typename: 'UserLoyaltyCard' } | null;
  };
};

export const GetTenantMyPageDocument = gql`
  query GetTenantMyPage {
    viewing {
      ...NavbarViewingParts
      ...TenantForMyPageMenu
    }
    viewer {
      ...NavbarViewerParts
      ...MyPageProfileHeader
      ...UserForMyPageMenu
    }
  }
  ${NavbarViewingPartsFragmentDoc}
  ${TenantForMyPageMenuFragmentDoc}
  ${NavbarViewerPartsFragmentDoc}
  ${NavbarMenuViewerFragmentDoc}
  ${GeneralNavbarMenuViewerFragmentDoc}
  ${MyPageProfileHeaderFragmentDoc}
  ${UserForMyPageMenuFragmentDoc}
`;

export function useGetTenantMyPageQuery(options?: Omit<Urql.UseQueryArgs<GetTenantMyPageQueryVariables>, 'query'>) {
  return Urql.useQuery<GetTenantMyPageQuery, GetTenantMyPageQueryVariables>({
    query: GetTenantMyPageDocument,
    ...options,
  });
}
