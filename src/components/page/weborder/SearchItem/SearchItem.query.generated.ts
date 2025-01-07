import gql from 'graphql-tag';
import * as Urql from 'urql';

import { DateTime } from '@/graphql/generated/types';

import * as Types from '../../../../graphql/generated/types';
import { CartFacilityNamePartsFragmentDoc } from '../../../domain/CartFacilityName/CartFacilityName.fragment.generated';
import { FeatureFlagsForProviderFragmentDoc } from '../../../../providers/FeatureFlagsProvider/FeatureFlagsProvider.fragment.generated';
import {
  NavbarViewingPartsFragmentDoc,
  NavbarViewerPartsFragmentDoc,
  NavbarMenuViewerFragmentDoc,
} from '../../../domain/Navbar/Navbar.fragment.generated';
import { TableCourseMenuStatsHeaderFragmentDoc } from '../../../domain/TableCourseMenuStatsHeader/TableCourseMenuStatsHeader.fragment.generated';
import { TableCourseMenuForTimerFragmentDoc } from '../../../domain/TableCourseMenuStatsHeader/LastOrderTimer.fragment.generated';
import { CartFooterButtonPartsFragmentDoc } from '../../../domain/FixedCartFooterButton/FixedCartFooterButton.fragment.generated';
import { GeneralNavbarMenuViewerFragmentDoc } from '../../../domain/Navbar/GeneralNavbarMenu.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetSearchItemPageQueryVariables = Types.Exact<{
  facilityID: Types.Scalars['ID']['input'];
  orderType: Types.OrderType;
}>;

export type GetSearchItemPageQuery = {
  __typename: 'Query';
  facility?:
    | { __typename: 'Cart' }
    | { __typename: 'Coupon' }
    | { __typename: 'CourseMenu' }
    | { __typename: 'CourseMenuCategory' }
    | { __typename: 'DeliveryOrder' }
    | { __typename: 'EatInOrder' }
    | {
        __typename: 'Facility';
        shortName: string;
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
  viewing: { __typename: 'Tenant'; logo: string };
  viewer: {
    __typename: 'User';
    table?: {
      __typename: 'Table';
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
      subCourseMenus: Array<{ __typename: 'TableCourseMenu'; courseMenu: { __typename: 'CourseMenu'; name: string } }>;
    } | null;
    cart: { __typename: 'Cart'; totalPrice: number; totalQuantity: number };
    profile?: { __typename: 'Profile'; imageUrl: string } | null;
    loyaltyCard?: { __typename: 'UserLoyaltyCard' } | null;
  };
};

export const GetSearchItemPageDocument = gql`
  query GetSearchItemPage($facilityID: ID!, $orderType: OrderType!) {
    facility: node(id: $facilityID) {
      ... on Facility {
        ...CartFacilityNameParts
        featureFlags {
          ...FeatureFlagsForProvider
        }
      }
    }
    viewing {
      ...NavbarViewingParts
    }
    viewer {
      table(facilityID: $facilityID) {
        name
        ...TableCourseMenuStatsHeader
      }
      cart(facilityID: $facilityID, orderType: $orderType) {
        ...CartFooterButtonParts
      }
      ...NavbarViewerParts
    }
  }
  ${CartFacilityNamePartsFragmentDoc}
  ${FeatureFlagsForProviderFragmentDoc}
  ${NavbarViewingPartsFragmentDoc}
  ${TableCourseMenuStatsHeaderFragmentDoc}
  ${TableCourseMenuForTimerFragmentDoc}
  ${CartFooterButtonPartsFragmentDoc}
  ${NavbarViewerPartsFragmentDoc}
  ${NavbarMenuViewerFragmentDoc}
  ${GeneralNavbarMenuViewerFragmentDoc}
`;

export function useGetSearchItemPageQuery(options: Omit<Urql.UseQueryArgs<GetSearchItemPageQueryVariables>, 'query'>) {
  return Urql.useQuery<GetSearchItemPageQuery, GetSearchItemPageQueryVariables>({
    query: GetSearchItemPageDocument,
    ...options,
  });
}
