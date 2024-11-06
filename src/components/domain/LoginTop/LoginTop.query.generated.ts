import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
import { SignUpBenefitBannerPartsFragmentDoc } from '../SignUpBenefitBanner/SignUpBenefitBanner.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetAccountRegistrationIncentivesForSignUpQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetAccountRegistrationIncentivesForSignUpQuery = {
  __typename: 'Query';
  tenant: {
    __typename: 'Tenant';
    accountRegistrationIncentives: Array<{ __typename: 'AccountRegistrationIncentive'; title: string }>;
  };
};

export const GetAccountRegistrationIncentivesForSignUpDocument = gql`
  query GetAccountRegistrationIncentivesForSignUp {
    tenant: viewing {
      accountRegistrationIncentives {
        ...SignUpBenefitBannerParts
      }
    }
  }
  ${SignUpBenefitBannerPartsFragmentDoc}
`;

export function useGetAccountRegistrationIncentivesForSignUpQuery(
  options?: Omit<Urql.UseQueryArgs<GetAccountRegistrationIncentivesForSignUpQueryVariables>, 'query'>,
) {
  return Urql.useQuery<
    GetAccountRegistrationIncentivesForSignUpQuery,
    GetAccountRegistrationIncentivesForSignUpQueryVariables
  >({ query: GetAccountRegistrationIncentivesForSignUpDocument, ...options });
}
