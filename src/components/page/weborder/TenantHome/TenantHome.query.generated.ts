import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
import {
  NavbarViewingPartsFragmentDoc,
  NavbarViewerPartsFragmentDoc,
  NavbarMenuViewerFragmentDoc,
} from '../../../domain/Navbar/Navbar.fragment.generated';
import { HomeContainerPromotionEnabledSectionFragmentDoc } from '../../../domain/HomeContainerPromotionEnabledSection/HomeContainerPromotionEnabledSection.fragment.generated';
import { GeneralNavbarMenuViewerFragmentDoc } from '../../../domain/Navbar/GeneralNavbarMenu.generated';
import { HomeHeaderFragmentDoc } from '../../../domain/HomeHeader/HomeHeader.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetWebHomeSectionsForTenantPageQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetWebHomeSectionsForTenantPageQuery = {
  __typename: 'Query';
  viewing: {
    __typename: 'Tenant';
    mainVisualImage: string;
    logo: string;
    id: string;
    companyName: string;
    helpUrl: string;
    contactUrl: string;
    termsOfUseUrl: string;
    privacyPolicyUrl: string;
    specifiedCommercialTransactionActUrl: string;
    topPageBannerSections?: {
      __typename: 'TopPageBannerSections';
      bannerSection: {
        __typename: 'BannerSection';
        banners: Array<{ __typename: 'Banner'; image: string; url?: string | null; title: string }>;
      };
      navigationItemsSection: {
        __typename: 'BannerSection';
        banners: Array<{ __typename: 'Banner'; image: string; url?: string | null; title: string }>;
      };
    } | null;
  };
  viewer: {
    __typename: 'User';
    profile?: { __typename: 'Profile'; lastNameKana?: string | null; imageUrl: string } | null;
    coupons: { __typename: 'CouponConnection'; nodes: Array<{ __typename: 'Coupon'; id: string }> };
    loyaltyCard?: { __typename: 'UserLoyaltyCard' } | null;
  };
};

export type TenantHomeFooterInfoFragment = {
  __typename: 'Tenant';
  companyName: string;
  helpUrl: string;
  contactUrl: string;
  termsOfUseUrl: string;
  privacyPolicyUrl: string;
  specifiedCommercialTransactionActUrl: string;
};

export const TenantHomeFooterInfoFragmentDoc = gql`
  fragment TenantHomeFooterInfo on Tenant {
    companyName
    helpUrl
    contactUrl
    termsOfUseUrl
    privacyPolicyUrl
    specifiedCommercialTransactionActUrl
  }
`;
export const GetWebHomeSectionsForTenantPageDocument = gql`
  query GetWebHomeSectionsForTenantPage {
    viewing {
      mainVisualImage
      ...NavbarViewingParts
      ...HomeContainerPromotionEnabledSection
      ...TenantHomeFooterInfo
    }
    viewer {
      ...NavbarViewerParts
      ...HomeHeader
    }
  }
  ${NavbarViewingPartsFragmentDoc}
  ${HomeContainerPromotionEnabledSectionFragmentDoc}
  ${TenantHomeFooterInfoFragmentDoc}
  ${NavbarViewerPartsFragmentDoc}
  ${NavbarMenuViewerFragmentDoc}
  ${GeneralNavbarMenuViewerFragmentDoc}
  ${HomeHeaderFragmentDoc}
`;

export function useGetWebHomeSectionsForTenantPageQuery(
  options?: Omit<Urql.UseQueryArgs<GetWebHomeSectionsForTenantPageQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetWebHomeSectionsForTenantPageQuery, GetWebHomeSectionsForTenantPageQueryVariables>({
    query: GetWebHomeSectionsForTenantPageDocument,
    ...options,
  });
}
