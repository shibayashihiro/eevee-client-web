import gql from 'graphql-tag';
import * as Urql from 'urql';

import { DateTime } from '@/graphql/generated/types';

import * as Types from '../../../../graphql/generated/types';
import {
  NavbarViewingPartsFragmentDoc,
  NavbarViewerPartsFragmentDoc,
  NavbarMenuViewerFragmentDoc,
  NavbarMenuFacilityFragmentDoc,
} from '../../../domain/Navbar/Navbar.fragment.generated';
import { HomeMembershipCardSectionPartsFragmentDoc } from '../../../domain/HomeMembershipCardSection/HomeMembershipCardSection.fragment.generated';
import { HomeFacilityInfoSectionPartsFragmentDoc } from '../../../domain/HomeFacilityInfoSection/HomeFacilityInfoSection.fragment.generated';
import { HomeTakeoutFacilityInfoSectionFragmentDoc } from '../../../domain/HomeFacilityInfoSection/HomeTakeoutFacilityInfoSection.fragment.generated';
import { HomeDeliveryFacilityInfoSectionFragmentDoc } from '../../../domain/HomeFacilityInfoSection/HomeDeliveryFacilityInfoSection.fragment.generated';
import {
  HomeEatInFacilityInfoSectionFragmentDoc,
  HomeEatInFacilityInfoSectionTableFragmentDoc,
} from '../../../domain/HomeFacilityInfoSection/HomeEatInFacilityInfoSection.fragment.generated';
import { HomeMenuItemsSectionPartsFragmentDoc } from '../../../domain/HomeMenuItemsSection/HomeMenuItemsSection.fragment.generated';
import { HomeMenuCategoriesSectionPartsFragmentDoc } from '../../../domain/HomeMenuCategoriesSection/HomeMenuCategoriesSection.fragment.generated';
import { HomeBannerSectionPartsFragmentDoc } from '../../../domain/HomeBannerSection/HomeBannerSection.fragment.generated';
import { HomeBannerPartsFragmentDoc } from '../../../domain/HomeBannerSection/Banner.fragment.generated';
import { HomeCourseMenuCategoriesSectionFragmentDoc } from '../../../domain/HomeCourseMenuCategoriesSection/HomeCourseMenuCategoriesSection.fragment.generated';
import { CartFooterButtonPartsFragmentDoc } from '../../../domain/FixedCartFooterButton/FixedCartFooterButton.fragment.generated';
import { TableCourseMenuStatsHeaderFragmentDoc } from '../../../domain/TableCourseMenuStatsHeader/TableCourseMenuStatsHeader.fragment.generated';
import { TableCourseMenuForTimerFragmentDoc } from '../../../domain/TableCourseMenuStatsHeader/LastOrderTimer.fragment.generated';
import { HomeLastOrderPassedBannerFragmentDoc } from '../../../domain/HomeLastOrderPassedBanner/HomeLastOrderPassedBanner.fragment.generated';
import {
  GeneralNavbarMenuViewerFragmentDoc,
  GeneralNavbarMenuFacilityFragmentDoc,
} from '../../../domain/Navbar/GeneralNavbarMenu.generated';
import { FeatureFlagsForProviderFragmentDoc } from '../../../../providers/FeatureFlagsProvider/FeatureFlagsProvider.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetWebEatInHomeSectionsQueryVariables = Types.Exact<{
  facilityID: Types.Scalars['ID']['input'];
  orderType: Types.OrderType;
}>;

export type GetWebEatInHomeSectionsQuery = {
  __typename: 'Query';
  tenant: {
    __typename: 'Tenant';
    logo: string;
    layout: {
      __typename: 'Layout';
      webHome: {
        __typename: 'WebHome';
        sections: Array<
          | {
              __typename: 'BannerSection';
              banners: Array<{
                __typename: 'Banner';
                title: string;
                message: string;
                behavior: Types.BannerInteractionBehavior;
              }>;
            }
          | {
              __typename: 'CourseMenuCategoriesSection';
              categories: Array<{
                __typename: 'CourseMenuCategory';
                id: string;
                name: string;
                courses: Array<{
                  __typename: 'CourseMenu';
                  id: string;
                  name: string;
                  pricePerPerson?:
                    | { __typename: 'CourseMenuFixedPricePerPerson'; price: number; priceExcludingTax: number }
                    | { __typename: 'CourseMenuRangePricePerPerson'; minPrice: number; minPriceExcludingTax: number }
                    | null;
                }>;
              }>;
            }
          | { __typename: 'DeliverySection' }
          | {
              __typename: 'FacilityInfoSection';
              hasOtherFacilities: boolean;
              facility: { __typename: 'Facility'; shortName: string };
            }
          | { __typename: 'InProgressOrderSection' }
          | { __typename: 'MainVisualSection'; image: string }
          | { __typename: 'MembershipCardSection'; logo: string; membershipQRCodeData: string }
          | {
              __typename: 'MenuCategoriesSection';
              title: string;
              categories: Array<{
                __typename: 'MenuCategory';
                id: string;
                name: string;
                items: {
                  __typename: 'MenuItemConnection';
                  nodes: Array<{
                    __typename: 'MenuItem';
                    id: string;
                    name: string;
                    price: number;
                    priceExcludingTax: number;
                    image: string;
                    status: { __typename: 'MenuItemStatus'; available: boolean; labelUnavailable?: string | null };
                  }>;
                };
              }>;
            }
          | {
              __typename: 'MenuItemsSection';
              title: string;
              items: Array<{
                __typename: 'MenuItem';
                id: string;
                name: string;
                price: number;
                priceExcludingTax: number;
                image: string;
                status: { __typename: 'MenuItemStatus'; available: boolean; labelUnavailable?: string | null };
              }>;
            }
          | { __typename: 'SelectOrderTypeSection' }
          | { __typename: 'StatusSection'; title: string }
          | { __typename: 'TakeoutSection' }
        >;
      };
    };
  };
  viewer: {
    __typename: 'User';
    profile?: { __typename: 'Profile'; imageUrl: string } | null;
    loyaltyCard?: { __typename: 'UserLoyaltyCard' } | null;
  } & (
    | { __typename: 'User'; cart: { __typename: 'Cart'; totalPrice: number; totalQuantity: number } }
    | { __typename: 'User'; cart?: never }
  ) &
    (
      | {
          __typename: 'User';
          table?: {
            __typename: 'Table';
            cartRawId: string;
            name: string;
            mainCourseMenu?: {
              __typename: 'TableCourseMenu';
              lastOrderAt?: DateTime | null;
              noticeReadStatus: Types.NoticeReadStatus;
              courseMenu: {
                __typename: 'CourseMenu';
                name: string;
                ruleDescriptions: Array<string>;
                category?: { __typename: 'CourseMenuCategory'; name: string } | null;
              };
            } | null;
            subCourseMenus: Array<{
              __typename: 'TableCourseMenu';
              courseMenu: { __typename: 'CourseMenu'; name: string };
            }>;
          } | null;
        }
      | { __typename: 'User'; table?: never }
    );
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

export const GetWebEatInHomeSectionsDocument = gql`
  query GetWebEatInHomeSections($facilityID: ID!, $orderType: OrderType!) {
    tenant: viewing {
      ...NavbarViewingParts
      layout {
        webHome(facilityID: $facilityID, orderType: $orderType) {
          sections {
            ... on MainVisualSection {
              image
            }
            ... on StatusSection {
              title
            }
            ...HomeMembershipCardSectionParts
            ...HomeFacilityInfoSectionParts
            ...HomeMenuItemsSectionParts
            ...HomeMenuCategoriesSectionParts
            ...HomeBannerSectionParts
            ...HomeCourseMenuCategoriesSection
          }
        }
      }
    }
    viewer {
      ... @defer {
        cart(facilityID: $facilityID, orderType: $orderType) {
          ...CartFooterButtonParts
        }
        table(facilityID: $facilityID) {
          cartRawId
          ...HomeEatInFacilityInfoSectionTable
          ...TableCourseMenuStatsHeader
          mainCourseMenu {
            ...HomeLastOrderPassedBanner
          }
        }
      }
      ...NavbarViewerParts
    }
    facility: node(id: $facilityID) {
      ... on Facility {
        ...NavbarMenuFacility
        featureFlags {
          ...FeatureFlagsForProvider
        }
      }
    }
  }
  ${NavbarViewingPartsFragmentDoc}
  ${HomeMembershipCardSectionPartsFragmentDoc}
  ${HomeFacilityInfoSectionPartsFragmentDoc}
  ${HomeTakeoutFacilityInfoSectionFragmentDoc}
  ${HomeDeliveryFacilityInfoSectionFragmentDoc}
  ${HomeEatInFacilityInfoSectionFragmentDoc}
  ${HomeMenuItemsSectionPartsFragmentDoc}
  ${HomeMenuCategoriesSectionPartsFragmentDoc}
  ${HomeBannerSectionPartsFragmentDoc}
  ${HomeBannerPartsFragmentDoc}
  ${HomeCourseMenuCategoriesSectionFragmentDoc}
  ${CartFooterButtonPartsFragmentDoc}
  ${HomeEatInFacilityInfoSectionTableFragmentDoc}
  ${TableCourseMenuStatsHeaderFragmentDoc}
  ${TableCourseMenuForTimerFragmentDoc}
  ${HomeLastOrderPassedBannerFragmentDoc}
  ${NavbarViewerPartsFragmentDoc}
  ${NavbarMenuViewerFragmentDoc}
  ${GeneralNavbarMenuViewerFragmentDoc}
  ${NavbarMenuFacilityFragmentDoc}
  ${GeneralNavbarMenuFacilityFragmentDoc}
  ${FeatureFlagsForProviderFragmentDoc}
`;

export function useGetWebEatInHomeSectionsQuery(
  options: Omit<Urql.UseQueryArgs<GetWebEatInHomeSectionsQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetWebEatInHomeSectionsQuery, GetWebEatInHomeSectionsQueryVariables>({
    query: GetWebEatInHomeSectionsDocument,
    ...options,
  });
}
