import gql from 'graphql-tag';
export type CartFacilityNamePartsFragment = { __typename: 'Facility'; shortName: string };

export const CartFacilityNamePartsFragmentDoc = gql`
  fragment CartFacilityNameParts on Facility {
    shortName
  }
`;
