import gql from 'graphql-tag';
export type ChargeDetailsFullListPartsFragment = {
  __typename: 'Charge';
  amount: number;
  details: Array<{ __typename: 'ChargeDetail'; name: string; amount: number }>;
};

export const ChargeDetailsFullListPartsFragmentDoc = gql`
  fragment ChargeDetailsFullListParts on Charge {
    amount
    details {
      ... on ChargeDetail {
        name
        amount
      }
    }
  }
`;
