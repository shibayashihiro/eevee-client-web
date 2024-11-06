import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';

import { BenefitUsageForMySubscriptionBenefitPageFragmentDoc } from './MySubscriptionBenefit.query.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SubmitUseSubscriptionBenefitMutationVariables = Types.Exact<{
  input: Types.UseSubscriptionBenefitInput;
}>;

export type SubmitUseSubscriptionBenefitMutation = {
  __typename: 'Mutation';
  useSubscriptionBenefit: {
    __typename: 'UseSubscriptionBenefitPayload';
    benefitUsage: {
      __typename: 'UserSubscriptionBenefitUsage';
      used: number;
      limit?: number | null;
      benefit: { __typename: 'SubscriptionBenefit'; id: string; title: string };
    };
  };
};

export const SubmitUseSubscriptionBenefitDocument = gql`
  mutation submitUseSubscriptionBenefit($input: UseSubscriptionBenefitInput!) {
    useSubscriptionBenefit(input: $input) {
      benefitUsage {
        ...BenefitUsageForMySubscriptionBenefitPage
      }
    }
  }
  ${BenefitUsageForMySubscriptionBenefitPageFragmentDoc}
`;

export function useSubmitUseSubscriptionBenefitMutation() {
  return Urql.useMutation<SubmitUseSubscriptionBenefitMutation, SubmitUseSubscriptionBenefitMutationVariables>(
    SubmitUseSubscriptionBenefitDocument,
  );
}
