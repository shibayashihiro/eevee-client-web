import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
import { SelectableSubscriptionPlanCardFragmentDoc } from '../../../domain/SubscriptionPlanCard/SelectableSubscriptionPlanCard.fragment.generated';
import { SubscriptionPlanCardFragmentDoc } from '../../../domain/SubscriptionPlanCard/SubscriptionPlanCard.fragment.generated';
import {
  SubscriptionPlanForRegistrationProcessFragmentDoc,
  SubscriptionForRegistrationProcessFragmentDoc,
  UserForSubscriptionPlanRegistrationProcessFragmentDoc,
} from '../../../domain/SubscriptionRegistrationProcessBottomSheet/SubscriptionRegistrationProcess.fragment.generated';
import { PaymentDialogPartsFragmentDoc } from '../../../domain/PaymentDialog/PaymentDialog.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetSubscriptionPlansPageQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetSubscriptionPlansPageQuery = {
  __typename: 'Query';
  viewing: {
    __typename: 'Tenant';
    subscription?: {
      __typename: 'TenantSubscription';
      title: string;
      description: string;
      helpUrl: string;
      contactUrl: string;
      id: string;
      termsOfUseUrl: string;
      specialAgreementUrl: string;
      availableDays: number;
      features: Array<{ __typename: 'SubscriptionFeature'; title: string; description: string; icon: string }>;
      plans: Array<{
        __typename: 'SubscriptionPlan';
        id: string;
        title: string;
        price: number;
        recommendedComment: string;
        benefits: Array<{ __typename: 'SubscriptionBenefit'; title: string }>;
      }>;
    } | null;
  };
  viewer: {
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
};

export const GetSubscriptionPlansPageDocument = gql`
  query GetSubscriptionPlansPage {
    viewing {
      subscription {
        title
        description
        features {
          title
          description
          icon
        }
        plans {
          id
          ...SelectableSubscriptionPlanCard
          ...SubscriptionPlanForRegistrationProcess
        }
        helpUrl
        contactUrl
        ...SubscriptionForRegistrationProcess
      }
    }
    viewer {
      ...UserForSubscriptionPlanRegistrationProcess
    }
  }
  ${SelectableSubscriptionPlanCardFragmentDoc}
  ${SubscriptionPlanCardFragmentDoc}
  ${SubscriptionPlanForRegistrationProcessFragmentDoc}
  ${SubscriptionForRegistrationProcessFragmentDoc}
  ${UserForSubscriptionPlanRegistrationProcessFragmentDoc}
  ${PaymentDialogPartsFragmentDoc}
`;

export function useGetSubscriptionPlansPageQuery(
  options?: Omit<Urql.UseQueryArgs<GetSubscriptionPlansPageQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetSubscriptionPlansPageQuery, GetSubscriptionPlansPageQueryVariables>({
    query: GetSubscriptionPlansPageDocument,
    ...options,
  });
}
