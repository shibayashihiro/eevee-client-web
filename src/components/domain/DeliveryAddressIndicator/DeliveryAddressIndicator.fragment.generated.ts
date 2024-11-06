import gql from 'graphql-tag';
export type DeliveryAddressIndicatorPartsFragment = {
  __typename: 'DeliveryAddress';
  id: string;
  prefecture: string;
  addressLine: string;
  buildingName: string;
  memo?: string | null;
  isUsing: boolean;
};

export const DeliveryAddressIndicatorPartsFragmentDoc = gql`
  fragment DeliveryAddressIndicatorParts on DeliveryAddress {
    id
    prefecture
    addressLine
    buildingName
    memo
    isUsing
  }
`;
