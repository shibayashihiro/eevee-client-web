import gql from 'graphql-tag';
export type DeliveryLastOrderInputPartsFragment = {
  __typename: 'LastOrderInput';
  lastNameKana: string;
  phoneNumber: string;
};

export const DeliveryLastOrderInputPartsFragmentDoc = gql`
  fragment DeliveryLastOrderInputParts on LastOrderInput {
    lastNameKana
    phoneNumber
  }
`;
