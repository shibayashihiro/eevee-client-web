import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
import { UserSubscriptionForRouteGuardFragmentDoc } from '../../../domain/SubscriptionRouteGuard/SubscriptionRouteGuard.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetMySubscriptionBenefitPageQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetMySubscriptionBenefitPageQuery = {
  __typename: 'Query';
  viewer: {
    __typename: 'User';
    subscription?: {
      __typename: 'UserSubscription';
      currentPlan: {
        __typename: 'UserSubscriptionPlan';
        status: Types.UserSubscriptionStatus;
        plan: { __typename: 'SubscriptionPlan'; id: string; title: string };
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

export type PlanForMySubscriptionBenefitPageFragment = { __typename: 'SubscriptionPlan'; id: string; title: string };

export type BenefitUsageForMySubscriptionBenefitPageFragment = {
  __typename: 'UserSubscriptionBenefitUsage';
  used: number;
  limit?: number | null;
  benefit: { __typename: 'SubscriptionBenefit'; id: string; title: string };
};

export const PlanForMySubscriptionBenefitPageFragmentDoc = gql`
  fragment PlanForMySubscriptionBenefitPage on SubscriptionPlan {
    id
    title
  }
`;
export const BenefitUsageForMySubscriptionBenefitPageFragmentDoc = gql`
  fragment BenefitUsageForMySubscriptionBenefitPage on UserSubscriptionBenefitUsage {
    benefit {
      id
      title
    }
    used
    limit
  }
`;
export const GetMySubscriptionBenefitPageDocument = gql`
  query GetMySubscriptionBenefitPage {
    viewer {
      subscription {
        currentPlan {
          plan {
            id
            title
          }
          benefitUsages {
            benefit {
              id
              title
            }
            used
            limit
          }
        }
        ...UserSubscriptionForRouteGuard
      }
    }
  }
  ${UserSubscriptionForRouteGuardFragmentDoc}
`;

export function useGetMySubscriptionBenefitPageQuery(
  options?: Omit<Urql.UseQueryArgs<GetMySubscriptionBenefitPageQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetMySubscriptionBenefitPageQuery, GetMySubscriptionBenefitPageQueryVariables>({
    query: GetMySubscriptionBenefitPageDocument,
    ...options,
  });
}
