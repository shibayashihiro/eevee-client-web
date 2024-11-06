import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetTableForLiffInitQueryVariables = Types.Exact<{
  tableId: Types.Scalars['ID']['input'];
}>;

export type GetTableForLiffInitQuery = {
  __typename: 'Query';
  table: {
    __typename: 'Table';
    id: string;
    isCustomerAttributesCollected: boolean;
    mainCourseMenu?: { __typename: 'TableCourseMenu' } | null;
  };
};

export type GetCourseMenuFeatureFlagForLiffInitQueryVariables = Types.Exact<{
  facilityId: Types.Scalars['ID']['input'];
}>;

export type GetCourseMenuFeatureFlagForLiffInitQuery = {
  __typename: 'Query';
  facility?:
    | { __typename: 'Cart' }
    | { __typename: 'Coupon' }
    | { __typename: 'CourseMenu' }
    | { __typename: 'CourseMenuCategory' }
    | { __typename: 'DeliveryOrder' }
    | { __typename: 'EatInOrder' }
    | { __typename: 'Facility'; featureFlags: { __typename: 'FeatureFlags'; eatInCourseMenuModeEnabled: boolean } }
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

export const GetTableForLiffInitDocument = gql`
  query GetTableForLIFFInit($tableId: ID!) {
    table: tableWithMergeSupport(tableId: $tableId) {
      id
      isCustomerAttributesCollected
      mainCourseMenu {
        __typename
      }
    }
  }
`;

export function useGetTableForLiffInitQuery(
  options: Omit<Urql.UseQueryArgs<GetTableForLiffInitQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetTableForLiffInitQuery, GetTableForLiffInitQueryVariables>({
    query: GetTableForLiffInitDocument,
    ...options,
  });
}
export const GetCourseMenuFeatureFlagForLiffInitDocument = gql`
  query GetCourseMenuFeatureFlagForLIFFInit($facilityId: ID!) {
    facility: node(id: $facilityId) {
      ... on Facility {
        featureFlags {
          eatInCourseMenuModeEnabled
        }
      }
    }
  }
`;

export function useGetCourseMenuFeatureFlagForLiffInitQuery(
  options: Omit<Urql.UseQueryArgs<GetCourseMenuFeatureFlagForLiffInitQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetCourseMenuFeatureFlagForLiffInitQuery, GetCourseMenuFeatureFlagForLiffInitQueryVariables>({
    query: GetCourseMenuFeatureFlagForLiffInitDocument,
    ...options,
  });
}
