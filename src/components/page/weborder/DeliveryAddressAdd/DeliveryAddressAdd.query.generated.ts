import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetPlaceDetailsForInputAddressQueryVariables = Types.Exact<{
  placeId: Types.Scalars['String']['input'];
}>;

export type GetPlaceDetailsForInputAddressQuery = {
  __typename: 'Query';
  placeAddress: {
    __typename: 'PlaceAddress';
    prefecture: string;
    addressLine: string;
    latLng: { __typename: 'LatLng'; latitude: number; longitude: number };
  };
};

export const GetPlaceDetailsForInputAddressDocument = gql`
  query GetPlaceDetailsForInputAddress($placeId: String!) {
    placeAddress(placeId: $placeId) {
      prefecture
      addressLine
      latLng {
        latitude
        longitude
      }
    }
  }
`;

export function useGetPlaceDetailsForInputAddressQuery(
  options: Omit<Urql.UseQueryArgs<GetPlaceDetailsForInputAddressQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetPlaceDetailsForInputAddressQuery, GetPlaceDetailsForInputAddressQueryVariables>({
    query: GetPlaceDetailsForInputAddressDocument,
    ...options,
  });
}
