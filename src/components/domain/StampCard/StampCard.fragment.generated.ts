import gql from 'graphql-tag';
export type StampCardPartsFragment = {
  __typename: 'StampCard';
  reward: string;
  currentPoints: number;
  maxPointPerPage: number;
};

export const StampCardPartsFragmentDoc = gql`
  fragment StampCardParts on StampCard {
    reward
    currentPoints
    maxPointPerPage
  }
`;
