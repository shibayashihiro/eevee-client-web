import gql from 'graphql-tag';
export type LastOrderInputPartsFragment = {
  __typename: 'LastOrderInput';
  lastNameKana: string;
  email: string;
  phoneNumber: string;
};

export const LastOrderInputPartsFragmentDoc = gql`
  fragment LastOrderInputParts on LastOrderInput {
    lastNameKana
    email
    phoneNumber
  }
`;
