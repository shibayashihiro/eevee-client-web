import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
import {
  NavbarViewingPartsFragmentDoc,
  NavbarViewerPartsFragmentDoc,
  NavbarMenuViewerFragmentDoc,
} from '../../../domain/Navbar/Navbar.fragment.generated';
import { HomeMembershipCardSectionPartsFragmentDoc } from '../../../domain/HomeMembershipCardSection/HomeMembershipCardSection.fragment.generated';
import { HomeFacilityInfoSectionPartsFragmentDoc } from '../../../domain/HomeFacilityInfoSection/HomeFacilityInfoSection.fragment.generated';
import { HomeTakeoutFacilityInfoSectionFragmentDoc } from '../../../domain/HomeFacilityInfoSection/HomeTakeoutFacilityInfoSection.fragment.generated';
import { HomeDeliveryFacilityInfoSectionFragmentDoc } from '../../../domain/HomeFacilityInfoSection/HomeDeliveryFacilityInfoSection.fragment.generated';
import { HomeEatInFacilityInfoSectionFragmentDoc } from '../../../domain/HomeFacilityInfoSection/HomeEatInFacilityInfoSection.fragment.generated';
import { HomeMenuItemsSectionPartsFragmentDoc } from '../../../domain/HomeMenuItemsSection/HomeMenuItemsSection.fragment.generated';
import { HomeMenuCategoriesSectionPartsFragmentDoc } from '../../../domain/HomeMenuCategoriesSection/HomeMenuCategoriesSection.fragment.generated';
import { HomeInProgressOrderSectionPartsFragmentDoc } from '../../../domain/HomeInProgressOrderSection/HomeInProgressOrderSection.fragment.generated';
import { CartFooterButtonPartsFragmentDoc } from '../../../domain/FixedCartFooterButton/FixedCartFooterButton.fragment.generated';
import { GeneralNavbarMenuViewerFragmentDoc } from '../../../domain/Navbar/GeneralNavbarMenu.generated';
import { FeatureFlagsForProviderFragmentDoc } from '../../../../providers/FeatureFlagsProvider/FeatureFlagsProvider.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetWebTakeoutHomeSectionsQueryVariables = Types.Exact<{
  facilityID: Types.Scalars['ID']['input'];
  orderType: Types.OrderType;
}>;

export type GetWebTakeoutHomeSectionsQuery = {
  __typename: 'Query';
  tenant: {
    __typename: 'Tenant';
    logo: string;
    layout: {
      __typename: 'Layout';
      webHome: {
        __typename: 'WebHome';
        sections: Array<
          | { __typename: 'BannerSection' }
          | { __typename: 'CourseMenuCategoriesSection' }
          | { __typename: 'DeliverySection' }
          | {
              __typename: 'FacilityInfoSection';
              hasOtherFacilities: boolean;
              facility: { __typename: 'Facility'; shortName: string };
            }
          | {
              __typename: 'InProgressOrderSection';
              orders: Array<
                | {
                    __typename: 'DeliveryOrder';
                    id: string;
                    shortIds: Array<string>;
                    progress?: { __typename: 'Progress'; stepSubject: string; scheduledTime: string } | null;
                  }
                | {
                    __typename: 'EatInOrder';
                    id: string;
                    shortIds: Array<string>;
                    progress?: { __typename: 'Progress'; stepSubject: string; scheduledTime: string } | null;
                  }
                | {
                    __typename: 'TableOrder';
                    id: string;
                    shortIds: Array<string>;
                    progress?: { __typename: 'Progress'; stepSubject: string; scheduledTime: string } | null;
                  }
                | {
                    __typename: 'TakeoutOrder';
                    id: string;
                    shortIds: Array<string>;
                    progress?: { __typename: 'Progress'; stepSubject: string; scheduledTime: string } | null;
                  }
              >;
            }
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
          | { __typename: 'TakeoutSection'; selectedScheduledTime: string }
        >;
      };
    };
  };
  viewer: {
    __typename: 'User';
    cart: { __typename: 'Cart'; totalPrice: number; totalQuantity: number };
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

export const GetWebTakeoutHomeSectionsDocument = gql`
  query GetWebTakeoutHomeSections($facilityID: ID!, $orderType: OrderType!) {
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
            ... on TakeoutSection {
              selectedScheduledTime
            }
            ...HomeMembershipCardSectionParts
            ...HomeFacilityInfoSectionParts
            ...HomeMenuItemsSectionParts
            ...HomeMenuCategoriesSectionParts
            ...HomeInProgressOrderSectionParts
          }
        }
      }
    }
    viewer {
      cart(facilityID: $facilityID, orderType: $orderType) {
        ...CartFooterButtonParts
      }
      ...NavbarViewerParts
    }
    facility: node(id: $facilityID) {
      ... on Facility {
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
  ${HomeInProgressOrderSectionPartsFragmentDoc}
  ${CartFooterButtonPartsFragmentDoc}
  ${NavbarViewerPartsFragmentDoc}
  ${NavbarMenuViewerFragmentDoc}
  ${GeneralNavbarMenuViewerFragmentDoc}
  ${FeatureFlagsForProviderFragmentDoc}
`;

export function useGetWebTakeoutHomeSectionsQuery(
  options: Omit<Urql.UseQueryArgs<GetWebTakeoutHomeSectionsQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetWebTakeoutHomeSectionsQuery, GetWebTakeoutHomeSectionsQueryVariables>({
    query: GetWebTakeoutHomeSectionsDocument,
    ...options,
  });
}
