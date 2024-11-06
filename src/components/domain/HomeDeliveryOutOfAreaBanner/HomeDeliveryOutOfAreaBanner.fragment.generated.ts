import gql from 'graphql-tag';
export type HomeDeliveryOutOfAreaBannerPartsFragment = {
  __typename: 'DeliveryAddress';
  latLng: { __typename: 'LatLng'; latitude: number; longitude: number };
};

export const HomeDeliveryOutOfAreaBannerPartsFragmentDoc = gql`
  fragment HomeDeliveryOutOfAreaBannerParts on DeliveryAddress {
    latLng {
      latitude
      longitude
    }
  }
`;
