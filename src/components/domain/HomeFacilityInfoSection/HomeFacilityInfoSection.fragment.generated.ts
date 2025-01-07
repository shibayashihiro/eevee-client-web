import gql from 'graphql-tag';

export type HomeFacilityInfoSectionPartsFragment = {
  __typename: 'FacilityInfoSection';
  hasOtherFacilities: boolean;
  facility: { __typename: 'Facility'; shortName: string };
};

export const HomeFacilityInfoSectionPartsFragmentDoc = gql`
  fragment HomeFacilityInfoSectionParts on FacilityInfoSection {
    ...HomeTakeoutFacilityInfoSection
    ...HomeDeliveryFacilityInfoSection
    ...HomeEatInFacilityInfoSection
  }
`;
