import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
import {
  NavbarViewingPartsFragmentDoc,
  NavbarViewerPartsFragmentDoc,
} from '../../../domain/Navbar/Navbar.fragment.generated';
import { NavbarMenuViewerFragmentDoc } from '../../../domain/Navbar/NavbarMenu.fragment.generated';
import { FeatureFlagsForProviderFragmentDoc } from '../../../../providers/FeatureFlagsProvider/FeatureFlagsProvider.fragment.generated';

import { CourseMenuAsMenuItemDetail_CourseMenuInfoFragmentDoc } from './CourseMenuInfo.fragment.generated';
import { CourseMenuAsMenuItemDetail_CourseMenuEntriesInputFragmentDoc } from './CourseMenuEntriesInput.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetCourseMenuForMenuItemDetailQueryVariables = Types.Exact<{
  courseId: Types.Scalars['ID']['input'];
  facilityId: Types.Scalars['ID']['input'];
  orderType: Types.OrderType;
}>;

export type GetCourseMenuForMenuItemDetailQuery = {
  __typename: 'Query';
  tenant: { __typename: 'Tenant'; logo: string };
  courseMenu?:
    | { __typename: 'Cart' }
    | { __typename: 'Coupon' }
    | {
        __typename: 'CourseMenu';
        id: string;
        name: string;
        description?: string | null;
        minSelectCount: number;
        entries: Array<{
          __typename: 'CourseMenuEntry';
          id: string;
          name: string;
          price: number;
          priceExcludingTax: number;
        }>;
      }
    | { __typename: 'CourseMenuCategory' }
    | { __typename: 'DeliveryOrder' }
    | { __typename: 'EatInOrder' }
    | { __typename: 'Facility' }
    | { __typename: 'MenuCategory' }
    | { __typename: 'MenuItem' }
    | { __typename: 'Survey' }
    | { __typename: 'Table' }
    | { __typename: 'TableOrder' }
    | { __typename: 'TakeoutOrder' }
    | { __typename: 'Tenant' }
    | { __typename: 'User' }
    | null;
  viewer: {
    __typename: 'User';
    cart: { __typename: 'Cart'; id: string };
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

export const GetCourseMenuForMenuItemDetailDocument = gql`
  query GetCourseMenuForMenuItemDetail($courseId: ID!, $facilityId: ID!, $orderType: OrderType!) {
    tenant: viewing {
      ...NavbarViewingParts
    }
    courseMenu: node(id: $courseId) {
      ... on CourseMenu {
        id
        ...CourseMenuAsMenuItemDetail_CourseMenuInfo
        ...CourseMenuAsMenuItemDetail_CourseMenuEntriesInput
        entries {
          id
          name
          price
        }
      }
    }
    viewer {
      cart(facilityID: $facilityId, orderType: $orderType) {
        id
      }
      ...NavbarViewerParts
    }
    facility: node(id: $facilityId) {
      ... on Facility {
        featureFlags {
          ...FeatureFlagsForProvider
        }
      }
    }
  }
  ${NavbarViewingPartsFragmentDoc}
  ${CourseMenuAsMenuItemDetail_CourseMenuInfoFragmentDoc}
  ${CourseMenuAsMenuItemDetail_CourseMenuEntriesInputFragmentDoc}
  ${NavbarViewerPartsFragmentDoc}
  ${NavbarMenuViewerFragmentDoc}
  ${FeatureFlagsForProviderFragmentDoc}
`;

export function useGetCourseMenuForMenuItemDetailQuery(
  options: Omit<Urql.UseQueryArgs<GetCourseMenuForMenuItemDetailQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetCourseMenuForMenuItemDetailQuery, GetCourseMenuForMenuItemDetailQueryVariables>({
    query: GetCourseMenuForMenuItemDetailDocument,
    ...options,
  });
}
