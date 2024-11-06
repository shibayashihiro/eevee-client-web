import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
import {
  NavbarViewingPartsFragmentDoc,
  NavbarViewerPartsFragmentDoc,
} from '../../../domain/Navbar/Navbar.fragment.generated';
import { NavbarMenuViewerFragmentDoc } from '../../../domain/Navbar/NavbarMenu.fragment.generated';
import {
  CourseMenuCategoryListItemFragmentDoc,
  CourseMenuListItemFragmentDoc,
} from '../../../domain/CourseMenuCategoryListItem/CourseMenuCategoryListItem.fragment.generated';
import { FeatureFlagsForProviderFragmentDoc } from '../../../../providers/FeatureFlagsProvider/FeatureFlagsProvider.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetCourseMenusPageQueryVariables = Types.Exact<{
  facilityId: Types.Scalars['ID']['input'];
}>;

export type GetCourseMenusPageQuery = {
  __typename: 'Query';
  viewing: { __typename: 'Tenant'; logo: string };
  viewer: {
    __typename: 'User';
    profile?: { __typename: 'Profile'; imageUrl: string } | null;
    loyaltyCard?: { __typename: 'UserLoyaltyCard' } | null;
  };
  courseMenuCategories: Array<{
    __typename: 'CourseMenuCategory';
    id: string;
    name: string;
    description?: string | null;
    courses: Array<{
      __typename: 'CourseMenu';
      id: string;
      name: string;
      description?: string | null;
      ruleDescriptions: Array<string>;
      pricePerPerson?:
        | { __typename: 'CourseMenuFixedPricePerPerson'; price: number; priceExcludingTax: number }
        | { __typename: 'CourseMenuRangePricePerPerson'; minPrice: number; minPriceExcludingTax: number }
        | null;
    }>;
  }>;
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

export const GetCourseMenusPageDocument = gql`
  query GetCourseMenusPage($facilityId: ID!) {
    viewing {
      ...NavbarViewingParts
    }
    viewer {
      ...NavbarViewerParts
    }
    courseMenuCategories(facilityId: $facilityId) {
      ...CourseMenuCategoryListItem
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
  ${NavbarViewerPartsFragmentDoc}
  ${NavbarMenuViewerFragmentDoc}
  ${CourseMenuCategoryListItemFragmentDoc}
  ${CourseMenuListItemFragmentDoc}
  ${FeatureFlagsForProviderFragmentDoc}
`;

export function useGetCourseMenusPageQuery(
  options: Omit<Urql.UseQueryArgs<GetCourseMenusPageQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetCourseMenusPageQuery, GetCourseMenusPageQueryVariables>({
    query: GetCourseMenusPageDocument,
    ...options,
  });
}
