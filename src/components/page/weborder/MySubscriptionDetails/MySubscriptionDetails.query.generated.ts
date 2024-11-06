import gql from 'graphql-tag';
import * as Urql from 'urql';

import { DateTime } from '@/graphql/generated/types';

import * as Types from '../../../../graphql/generated/types';
import { PaymentItemPartsFragmentDoc } from '../../../domain/PaymentItem/PaymentItem.fragment.generated';
import { UserSubscriptionForRouteGuardFragmentDoc } from '../../../domain/SubscriptionRouteGuard/SubscriptionRouteGuard.fragment.generated';

import { UserSubscriptionStatusBadgeFragmentDoc } from './StatusBadge.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetMySubscriptionDetailsPageQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetMySubscriptionDetailsPageQuery = {
  __typename: 'Query';
  viewing: {
    __typename: 'Tenant';
    subscription?: { __typename: 'TenantSubscription'; title: string; helpUrl: string; contactUrl: string } | null;
  };
  viewer: {
    __typename: 'User';
    subscription?: {
      __typename: 'UserSubscription';
      currentPlan: {
        __typename: 'UserSubscriptionPlan';
        startedAt: DateTime;
        expiresAt: DateTime;
        status: Types.UserSubscriptionStatus;
        plan: {
          __typename: 'SubscriptionPlan';
          title: string;
          price: number;
          benefits: Array<{ __typename: 'SubscriptionBenefit'; title: string }>;
        };
      };
      paymentHistories: Array<{
        __typename: 'UserSubscriptionHistory';
        paidAt: DateTime;
        planTitle: string;
        amount: number;
      }>;
      payment: {
        __typename: 'Payment';
        brand: string;
        last4: string;
        isSelected: boolean;
        paymentType: Types.PaymentType;
      };
    } | null;
  };
};

export type TenantSubscriptionForMySubscriptionDetailsPageFragment = {
  __typename: 'TenantSubscription';
  title: string;
  helpUrl: string;
  contactUrl: string;
};

export type UserSubscriptionForDetailsPageFragment = {
  __typename: 'UserSubscription';
  currentPlan: {
    __typename: 'UserSubscriptionPlan';
    startedAt: DateTime;
    expiresAt: DateTime;
    status: Types.UserSubscriptionStatus;
    plan: {
      __typename: 'SubscriptionPlan';
      title: string;
      price: number;
      benefits: Array<{ __typename: 'SubscriptionBenefit'; title: string }>;
    };
  };
  paymentHistories: Array<{
    __typename: 'UserSubscriptionHistory';
    paidAt: DateTime;
    planTitle: string;
    amount: number;
  }>;
  payment: { __typename: 'Payment'; brand: string; last4: string; isSelected: boolean; paymentType: Types.PaymentType };
};

export type UserSubscriptionStatusDescriptionFragment = {
  __typename: 'UserSubscription';
  payment: { __typename: 'Payment'; brand: string; last4: string };
};

export const TenantSubscriptionForMySubscriptionDetailsPageFragmentDoc = gql`
  fragment TenantSubscriptionForMySubscriptionDetailsPage on TenantSubscription {
    title
    helpUrl
    contactUrl
  }
`;
export const UserSubscriptionStatusDescriptionFragmentDoc = gql`
  fragment UserSubscriptionStatusDescription on UserSubscription {
    payment {
      brand
      last4
    }
  }
`;
export const UserSubscriptionForDetailsPageFragmentDoc = gql`
  fragment UserSubscriptionForDetailsPage on UserSubscription {
    currentPlan {
      plan {
        title
        price
        benefits {
          title
        }
      }
      startedAt
      expiresAt
      ...UserSubscriptionStatusBadge
    }
    paymentHistories {
      paidAt
      planTitle
      amount
    }
    payment {
      ...PaymentItemParts
    }
    ...UserSubscriptionStatusDescription
    ...UserSubscriptionForRouteGuard
  }
`;
export const GetMySubscriptionDetailsPageDocument = gql`
  query GetMySubscriptionDetailsPage {
    viewing {
      subscription {
        ...TenantSubscriptionForMySubscriptionDetailsPage
      }
    }
    viewer {
      subscription {
        ...UserSubscriptionForDetailsPage
      }
    }
  }
  ${TenantSubscriptionForMySubscriptionDetailsPageFragmentDoc}
  ${UserSubscriptionForDetailsPageFragmentDoc}
  ${UserSubscriptionStatusBadgeFragmentDoc}
  ${PaymentItemPartsFragmentDoc}
  ${UserSubscriptionStatusDescriptionFragmentDoc}
  ${UserSubscriptionForRouteGuardFragmentDoc}
`;

export function useGetMySubscriptionDetailsPageQuery(
  options?: Omit<Urql.UseQueryArgs<GetMySubscriptionDetailsPageQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetMySubscriptionDetailsPageQuery, GetMySubscriptionDetailsPageQueryVariables>({
    query: GetMySubscriptionDetailsPageDocument,
    ...options,
  });
}
