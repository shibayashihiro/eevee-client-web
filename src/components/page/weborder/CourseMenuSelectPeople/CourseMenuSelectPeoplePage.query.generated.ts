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
import { CourseMenuEntriesInputFragmentDoc } from '../../../domain/CourseMenuEntriesInput/CourseMenuEntriesInput.fragment.generated';
import { CourseMenuEntryForInputPeopleCountListItemFragmentDoc } from '../../../domain/CourseMenuEntriesInput/InputPeopleCountListItem.fragment.generated';
import { FeatureFlagsForProviderFragmentDoc } from '../../../../providers/FeatureFlagsProvider/FeatureFlagsProvider.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetCourseMenuSelectPeoplePageQueryVariables = Types.Exact<{
  facilityId: Types.Scalars['ID']['input'];
  courseMenuId: Types.Scalars['ID']['input'];
}>;

export type GetCourseMenuSelectPeoplePageQuery = {
  __typename: 'Query';
  viewing: { __typename: 'Tenant'; logo: string };
  viewer: {
    __typename: 'User';
    profile?: { __typename: 'Profile'; imageUrl: string } | null;
    loyaltyCard?: { __typename: 'UserLoyaltyCard' } | null;
  };
  courseMenu?:
    | { __typename: 'Cart' }
    | { __typename: 'Coupon' }
    | {
        __typename: 'CourseMenu';
        id: string;
        name: string;
        minSelectCount: number;
        suggestedCourses: Array<{ __typename: 'CourseMenu' }>;
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

export const GetCourseMenuSelectPeoplePageDocument = gql`
  query GetCourseMenuSelectPeoplePage($facilityId: ID!, $courseMenuId: ID!) {
    viewing {
      ...NavbarViewingParts
    }
    viewer {
      ...NavbarViewerParts
    }
    courseMenu: node(id: $courseMenuId) {
      ... on CourseMenu {
        id
        name
        ...CourseMenuEntriesInput
        suggestedCourses {
          __typename
        }
      }
    }
    facility: node(id: $facilityId) {
      ...NavbarMenuFacility
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
  ${GeneralNavbarMenuViewerFragmentDoc}
  ${CourseMenuEntriesInputFragmentDoc}
  ${CourseMenuEntryForInputPeopleCountListItemFragmentDoc}
  ${NavbarMenuFacilityFragmentDoc}
  ${GeneralNavbarMenuFacilityFragmentDoc}
  ${FeatureFlagsForProviderFragmentDoc}
`;

export function useGetCourseMenuSelectPeoplePageQuery(
  options: Omit<Urql.UseQueryArgs<GetCourseMenuSelectPeoplePageQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetCourseMenuSelectPeoplePageQuery, GetCourseMenuSelectPeoplePageQueryVariables>({
    query: GetCourseMenuSelectPeoplePageDocument,
    ...options,
  });
}
