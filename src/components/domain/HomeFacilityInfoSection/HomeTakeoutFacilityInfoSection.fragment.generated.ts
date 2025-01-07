import gql from 'graphql-tag';
export type HomeTakeoutFacilityInfoSectionFragment = {
  __typename: 'FacilityInfoSection';
  hasOtherFacilities: boolean;
  facility: { __typename: 'Facility'; shortName: string };
};

export const HomeTakeoutFacilityInfoSectionFragmentDoc = gql`
  fragment HomeTakeoutFacilityInfoSection on FacilityInfoSection {
    facility {
      shortName
    }
    hasOtherFacilities(orderType: TAKEOUT)
  }
`;
