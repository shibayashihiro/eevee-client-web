import gql from 'graphql-tag';
export type UserSubscriptionPlanForRegistrationCompletedFragment = {
  __typename: 'UserSubscriptionPlan';
  subscriptionMonth: number;
  plan: {
    __typename: 'SubscriptionPlan';
    title: string;
    benefits: Array<{ __typename: 'SubscriptionBenefit'; title: string }>;
  };
};

export const UserSubscriptionPlanForRegistrationCompletedFragmentDoc = gql`
  fragment UserSubscriptionPlanForRegistrationCompleted on UserSubscriptionPlan {
    plan {
      title
      benefits {
        title
      }
    }
    subscriptionMonth
  }
`;
