import gql from 'graphql-tag';
export type HomeDeliveryFacilityInfoSectionFragment = {
  __typename: 'FacilityInfoSection';
  facility: { __typename: 'Facility'; shortName: string };
};

export const HomeDeliveryFacilityInfoSectionFragmentDoc = gql`
  fragment HomeDeliveryFacilityInfoSection on FacilityInfoSection {
    facility {
      shortName
    }
  }
`;
