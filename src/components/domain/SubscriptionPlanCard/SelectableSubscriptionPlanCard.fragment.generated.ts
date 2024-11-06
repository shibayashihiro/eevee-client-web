import gql from 'graphql-tag';

export type SelectableSubscriptionPlanCardFragment = {
  __typename: 'SubscriptionPlan';
  id: string;
  title: string;
  price: number;
  recommendedComment: string;
  benefits: Array<{ __typename: 'SubscriptionBenefit'; title: string }>;
};

export const SelectableSubscriptionPlanCardFragmentDoc = gql`
  fragment SelectableSubscriptionPlanCard on SubscriptionPlan {
    id
    ...SubscriptionPlanCard
  }
`;
