import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
import { AvailableOrderTypeBadgePartsFragmentDoc } from '../AvailableOrderTypeBadge/AvailableOrderTypeBadge.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetFacilitiesForFacilityListPageQueryVariables = Types.Exact<{
  location?: Types.InputMaybe<Types.LatLngInput>;
}>;

export type GetFacilitiesForFacilityListPageQuery = {
  __typename: 'Query';
  viewing: {
    __typename: 'Tenant';
    facilities: Array<{
      __typename: 'Facility';
      id: string;
      shortName: string;
      image: string;
      address1: string;
      address2: string;
      isFavorite: boolean;
      availableOrderTypes: Array<{ __typename: 'AvailableOrderType'; label: string; orderType: Types.OrderType }>;
      featureFlags: { __typename: 'FeatureFlags'; itemCodeSearchEnabled: boolean };
      metaByLocation?: { __typename: 'FacilityMetaByLocation'; distance: number } | null;
    }>;
  };
};

export const GetFacilitiesForFacilityListPageDocument = gql`
  query GetFacilitiesForFacilityListPage($location: LatLngInput) {
    viewing {
      facilities(location: $location) {
        id
        shortName
        image
        address1
        address2
        availableOrderTypes {
          ...AvailableOrderTypeBadgeParts
        }
        isFavorite
        featureFlags {
          itemCodeSearchEnabled
        }
        metaByLocation(location: $location) {
          distance
        }
      }
    }
  }
  ${AvailableOrderTypeBadgePartsFragmentDoc}
`;

export function useGetFacilitiesForFacilityListPageQuery(
  options?: Omit<Urql.UseQueryArgs<GetFacilitiesForFacilityListPageQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetFacilitiesForFacilityListPageQuery, GetFacilitiesForFacilityListPageQueryVariables>({
    query: GetFacilitiesForFacilityListPageDocument,
    ...options,
  });
}
