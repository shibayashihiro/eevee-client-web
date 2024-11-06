import gql from 'graphql-tag';

import { DateTime } from '@/graphql/generated/types';

export type LoyaltyCardSystemFragment = {
  __typename: 'UserLoyaltyCard';
  loyaltyCard: {
    __typename: 'LoyaltyCard';
    hasRankUp: boolean;
    cautions: Array<string>;
    pointCondition: { __typename: 'LoyaltyCardPointCondition'; condition: string; caution?: string | null };
    ranks: Array<{
      __typename: 'LoyaltyCardRank';
      name: string;
      colorRGB: string;
      rankUpCondition: string;
      benefit?: string | null;
      stampCardRewards: Array<string>;
    }>;
  };
  currentRank: { __typename: 'LoyaltyCardRank'; name: string };
  expiration: { __typename: 'UserLoyaltyCardExpiration'; description?: string | null; expiredAt?: DateTime | null };
};

export const LoyaltyCardSystemFragmentDoc = gql`
  fragment LoyaltyCardSystem on UserLoyaltyCard {
    loyaltyCard {
      hasRankUp
      pointCondition {
        condition
        caution
      }
      ranks {
        name
        colorRGB
        rankUpCondition
        benefit
        stampCardRewards
      }
      cautions
    }
    currentRank {
      name
    }
    expiration {
      description
      expiredAt
    }
  }
`;
