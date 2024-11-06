import gql from 'graphql-tag';
export type InputAddressesInitializePartsFragment = {
  __typename: 'PlaceAddress';
  prefecture: string;
  addressLine: string;
};

export const InputAddressesInitializePartsFragmentDoc = gql`
  fragment InputAddressesInitializeParts on PlaceAddress {
    prefecture
    addressLine
  }
`;
