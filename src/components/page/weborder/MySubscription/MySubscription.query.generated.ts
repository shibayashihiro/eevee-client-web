import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetMySubscriptionPageQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetMySubscriptionPageQuery = {
  __typename: 'Query';
  viewing: { __typename: 'Tenant'; subscription?: { __typename: 'TenantSubscription'; title: string } | null };
  viewer: {
    __typename: 'User';
    profile?: { __typename: 'Profile'; displayName: string } | null;
    subscription?: {
      __typename: 'UserSubscription';
      currentPlan: {
        __typename: 'UserSubscriptionPlan';
        subscriptionMonth: number;
        plan: { __typename: 'SubscriptionPlan'; title: string };
        benefitUsages: Array<{
          __typename: 'UserSubscriptionBenefitUsage';
          used: number;
          limit?: number | null;
          benefit: { __typename: 'SubscriptionBenefit'; id: string; title: string };
        }>;
      };
    } | null;
  };
};

export type UserSubscriptionPlanForMySubscriptionPageFragment = {
  __typename: 'UserSubscriptionPlan';
  subscriptionMonth: number;
  plan: { __typename: 'SubscriptionPlan'; title: string };
  benefitUsages: Array<{
    __typename: 'UserSubscriptionBenefitUsage';
    used: number;
    limit?: number | null;
    benefit: { __typename: 'SubscriptionBenefit'; id: string; title: string };
  }>;
};

export type BenefitForMySubscriptionPageFragment = {
  __typename: 'UserSubscriptionBenefitUsage';
  used: number;
  limit?: number | null;
  benefit: { __typename: 'SubscriptionBenefit'; id: string; title: string };
};

export const BenefitForMySubscriptionPageFragmentDoc = gql`
  fragment BenefitForMySubscriptionPage on UserSubscriptionBenefitUsage {
    benefit {
      id
      title
    }
    used
    limit
  }
`;
export const UserSubscriptionPlanForMySubscriptionPageFragmentDoc = gql`
  fragment UserSubscriptionPlanForMySubscriptionPage on UserSubscriptionPlan {
    plan {
      title
    }
    benefitUsages {
      ...BenefitForMySubscriptionPage
    }
    subscriptionMonth
  }
`;
export const GetMySubscriptionPageDocument = gql`
  query GetMySubscriptionPage {
    viewing {
      subscription {
        title
      }
    }
    viewer {
      profile {
        displayName
      }
      subscription {
        currentPlan {
          ...UserSubscriptionPlanForMySubscriptionPage
        }
      }
    }
  }
  ${UserSubscriptionPlanForMySubscriptionPageFragmentDoc}
  ${BenefitForMySubscriptionPageFragmentDoc}
`;

export function useGetMySubscriptionPageQuery(
  options?: Omit<Urql.UseQueryArgs<GetMySubscriptionPageQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetMySubscriptionPageQuery, GetMySubscriptionPageQueryVariables>({
    query: GetMySubscriptionPageDocument,
    ...options,
  });
}
