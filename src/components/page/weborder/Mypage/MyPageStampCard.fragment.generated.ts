import gql from 'graphql-tag';
export type MyPageStampCardFragment = {
  __typename: 'User';
  loyaltyCard?: {
    __typename: 'UserLoyaltyCard';
    currentRank: { __typename: 'LoyaltyCardRank'; name: string; colorRGB: string };
    activeStampCards: Array<{
      __typename: 'StampCard';
      currentPoints: number;
      maxPointPerPage: number;
      reward: string;
    }>;
  } | null;
};

export type MyPageActiveStampCardFragment = {
  __typename: 'StampCard';
  currentPoints: number;
  maxPointPerPage: number;
  reward: string;
};

export const MyPageActiveStampCardFragmentDoc = gql`
  fragment MyPageActiveStampCard on StampCard {
    currentPoints
    maxPointPerPage
    reward
  }
`;
export const MyPageStampCardFragmentDoc = gql`
  fragment MyPageStampCard on User {
    loyaltyCard {
      currentRank {
        name
        colorRGB
      }
      activeStampCards {
        ...MyPageActiveStampCard
      }
    }
  }
`;
