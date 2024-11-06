import gql from 'graphql-tag';

import * as Types from '../../../graphql/generated/types';

export type SubscriptionForRegistrationProcessFragment = {
  __typename: 'TenantSubscription';
  id: string;
  title: string;
  termsOfUseUrl: string;
  specialAgreementUrl: string;
  availableDays: number;
};

export type SubscriptionPlanForRegistrationProcessFragment = {
  __typename: 'SubscriptionPlan';
  id: string;
  title: string;
  price: number;
  benefits: Array<{ __typename: 'SubscriptionBenefit'; title: string }>;
};

export type UserForSubscriptionPlanRegistrationProcessFragment = {
  __typename: 'User';
  payments: Array<{
    __typename: 'Payment';
    id: string;
    last4: string;
    brand: string;
    isSelected: boolean;
    paymentType: Types.PaymentType;
  }>;
  profile?: { __typename: 'Profile'; displayName: string } | null;
};

export const SubscriptionForRegistrationProcessFragmentDoc = gql`
  fragment SubscriptionForRegistrationProcess on TenantSubscription {
    id
    title
    termsOfUseUrl
    specialAgreementUrl
    availableDays
  }
`;
export const SubscriptionPlanForRegistrationProcessFragmentDoc = gql`
  fragment SubscriptionPlanForRegistrationProcess on SubscriptionPlan {
    id
    title
    price
    benefits {
      title
    }
  }
`;
export const UserForSubscriptionPlanRegistrationProcessFragmentDoc = gql`
  fragment UserForSubscriptionPlanRegistrationProcess on User {
    payments {
      ...PaymentDialogParts
    }
    profile {
      displayName
    }
  }
`;
