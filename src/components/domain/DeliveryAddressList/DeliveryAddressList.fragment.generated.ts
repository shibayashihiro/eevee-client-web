import gql from 'graphql-tag';
export type DeliveryAddressListPartsFragment = {
  __typename: 'DeliveryAddress';
  id: string;
  prefecture: string;
  addressLine: string;
  buildingName: string;
  memo?: string | null;
  isUsing: boolean;
};

export const DeliveryAddressListPartsFragmentDoc = gql`
  fragment DeliveryAddressListParts on DeliveryAddress {
    id
    prefecture
    addressLine
    buildingName
    memo
    isUsing
  }
`;
