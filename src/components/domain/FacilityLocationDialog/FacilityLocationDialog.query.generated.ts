import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetFacilityLocationQueryVariables = Types.Exact<{
  facilityID: Types.Scalars['ID']['input'];
}>;

export type GetFacilityLocationQuery = {
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
        name: string;
        address1: string;
        address2: string;
        postalCode: string;
        latLng: { __typename: 'LatLng'; latitude: number; longitude: number };
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

export const GetFacilityLocationDocument = gql`
  query GetFacilityLocation($facilityID: ID!) {
    facility: node(id: $facilityID) {
      ... on Facility {
        name
        address1
        address2
        postalCode
        latLng {
          latitude
          longitude
        }
      }
    }
  }
`;

export function useGetFacilityLocationQuery(
  options: Omit<Urql.UseQueryArgs<GetFacilityLocationQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetFacilityLocationQuery, GetFacilityLocationQueryVariables>({
    query: GetFacilityLocationDocument,
    ...options,
  });
}
