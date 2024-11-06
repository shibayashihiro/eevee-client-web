import gql from 'graphql-tag';
export type SubscriptionPlanCardFragment = {
  __typename: 'SubscriptionPlan';
  title: string;
  price: number;
  recommendedComment: string;
  benefits: Array<{ __typename: 'SubscriptionBenefit'; title: string }>;
};

export const SubscriptionPlanCardFragmentDoc = gql`
  fragment SubscriptionPlanCard on SubscriptionPlan {
    title
    price
    recommendedComment
    benefits {
      title
    }
  }
`;
