import gql from 'graphql-tag';
export type HomeEatInFacilityInfoSectionFragment = {
  __typename: 'FacilityInfoSection';
  facility: { __typename: 'Facility'; shortName: string };
};

export type HomeEatInFacilityInfoSectionTableFragment = { __typename: 'Table'; name: string };

export const HomeEatInFacilityInfoSectionFragmentDoc = gql`
  fragment HomeEatInFacilityInfoSection on FacilityInfoSection {
    facility {
      shortName
    }
  }
`;
export const HomeEatInFacilityInfoSectionTableFragmentDoc = gql`
  fragment HomeEatInFacilityInfoSectionTable on Table {
    name
  }
`;
