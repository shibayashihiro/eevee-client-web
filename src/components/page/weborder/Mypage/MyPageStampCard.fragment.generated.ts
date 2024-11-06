import gql from 'graphql-tag';
export type MyPageStampCardFragment = {
  __typename: 'UserLoyaltyCard';
  currentRank: { __typename: 'LoyaltyCardRank'; name: string; colorRGB: string };
  activeStampCards: Array<{ __typename: 'StampCard'; currentPoints: number; maxPointPerPage: number; reward: string }>;
};

export const MyPageStampCardFragmentDoc = gql`
  fragment MyPageStampCard on UserLoyaltyCard {
    currentRank {
      name
      colorRGB
    }
    activeStampCards {
      currentPoints
      maxPointPerPage
      reward
    }
  }
`;
