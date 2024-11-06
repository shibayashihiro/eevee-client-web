import gql from 'graphql-tag';
export type HomeFacilityInfoSectionPartsFragment = {
  __typename: 'FacilityInfoSection';
  hasOtherFacilities: boolean;
  facility: { __typename: 'Facility'; shortName: string };
};

export type HomeFacilityInfoSectionCurrentTablePartsFragment = { __typename: 'Table'; name: string };

export const HomeFacilityInfoSectionPartsFragmentDoc = gql`
  fragment HomeFacilityInfoSectionParts on FacilityInfoSection {
    facility {
      shortName
    }
    hasOtherFacilities(orderType: $orderType)
  }
`;
export const HomeFacilityInfoSectionCurrentTablePartsFragmentDoc = gql`
  fragment HomeFacilityInfoSectionCurrentTableParts on Table {
    name
  }
`;
