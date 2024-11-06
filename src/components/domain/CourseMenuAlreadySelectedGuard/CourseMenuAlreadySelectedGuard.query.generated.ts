import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
import { FeatureFlagsForProviderFragmentDoc } from '../../../providers/FeatureFlagsProvider/FeatureFlagsProvider.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetTableCourseMenusForAlreadySelectedGuardQueryVariables = Types.Exact<{
  tableId: Types.Scalars['ID']['input'];
  facilityId: Types.Scalars['ID']['input'];
}>;

export type GetTableCourseMenusForAlreadySelectedGuardQuery = {
  __typename: 'Query';
  table: { __typename: 'Table'; id: string; mainCourseMenu?: { __typename: 'TableCourseMenu' } | null };
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

export const GetTableCourseMenusForAlreadySelectedGuardDocument = gql`
  query GetTableCourseMenusForAlreadySelectedGuard($tableId: ID!, $facilityId: ID!) {
    table: tableWithMergeSupport(tableId: $tableId) {
      id
      mainCourseMenu {
        __typename
      }
    }
    facility: node(id: $facilityId) {
      __typename
      ... on Facility {
        featureFlags {
          ...FeatureFlagsForProvider
        }
      }
    }
  }
  ${FeatureFlagsForProviderFragmentDoc}
`;

export function useGetTableCourseMenusForAlreadySelectedGuardQuery(
  options: Omit<Urql.UseQueryArgs<GetTableCourseMenusForAlreadySelectedGuardQueryVariables>, 'query'>,
) {
  return Urql.useQuery<
    GetTableCourseMenusForAlreadySelectedGuardQuery,
    GetTableCourseMenusForAlreadySelectedGuardQueryVariables
  >({ query: GetTableCourseMenusForAlreadySelectedGuardDocument, ...options });
}
