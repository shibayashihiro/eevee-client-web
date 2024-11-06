import gql from 'graphql-tag';

export type StampCardsCarouselFragment = {
  __typename: 'UserLoyaltyCard';
  currentRank: { __typename: 'LoyaltyCardRank'; name: string; colorRGB: string };
  activeStampCards: Array<{ __typename: 'StampCard'; reward: string; currentPoints: number; maxPointPerPage: number }>;
};

export const StampCardsCarouselFragmentDoc = gql`
  fragment StampCardsCarousel on UserLoyaltyCard {
    currentRank {
      name
      colorRGB
    }
    activeStampCards {
      ...StampCardParts
    }
  }
`;
