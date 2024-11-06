import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
import { AvailableOrderTypeBadgePartsFragmentDoc } from '../AvailableOrderTypeBadge/AvailableOrderTypeBadge.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetDeliveryAvailableFacilitiesQueryVariables = Types.Exact<{
  location: Types.LatLngInput;
}>;

export type GetDeliveryAvailableFacilitiesQuery = {
  __typename: 'Query';
  deliveryAvailableFacilities: Array<{
    __typename: 'Facility';
    id: string;
    shortName: string;
    image: string;
    availableOrderTypes: Array<{ __typename: 'AvailableOrderType'; label: string; orderType: Types.OrderType }>;
    metaByLocation?: {
      __typename: 'FacilityMetaByLocation';
      distance: number;
      deliveryEstimatedArrivalTimeLabel: string;
    } | null;
  }>;
};

export const GetDeliveryAvailableFacilitiesDocument = gql`
  query GetDeliveryAvailableFacilities($location: LatLngInput!) {
    deliveryAvailableFacilities(location: $location) {
      id
      shortName
      image
      availableOrderTypes {
        ...AvailableOrderTypeBadgeParts
      }
      metaByLocation(location: $location) {
        distance
        deliveryEstimatedArrivalTimeLabel
      }
    }
  }
  ${AvailableOrderTypeBadgePartsFragmentDoc}
`;

export function useGetDeliveryAvailableFacilitiesQuery(
  options: Omit<Urql.UseQueryArgs<GetDeliveryAvailableFacilitiesQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetDeliveryAvailableFacilitiesQuery, GetDeliveryAvailableFacilitiesQueryVariables>({
    query: GetDeliveryAvailableFacilitiesDocument,
    ...options,
  });
}
