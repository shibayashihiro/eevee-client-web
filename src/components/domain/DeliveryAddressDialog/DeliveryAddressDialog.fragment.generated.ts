import gql from 'graphql-tag';
export type DeliveryAddressDialogPartsFragment = {
  __typename: 'DeliveryAddress';
  id: string;
  prefecture: string;
  addressLine: string;
  buildingName: string;
  memo?: string | null;
  isUsing: boolean;
};

export const DeliveryAddressDialogPartsFragmentDoc = gql`
  fragment DeliveryAddressDialogParts on DeliveryAddress {
    id
    prefecture
    addressLine
    buildingName
    memo
    isUsing
  }
`;
