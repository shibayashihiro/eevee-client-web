import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetSignUpStepInputCredentialsPageQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetSignUpStepInputCredentialsPageQuery = {
  __typename: 'Query';
  viewing: { __typename: 'Tenant'; termsOfUseUrl: string; privacyPolicyUrl: string };
};

export const GetSignUpStepInputCredentialsPageDocument = gql`
  query GetSignUpStepInputCredentialsPage {
    viewing {
      termsOfUseUrl
      privacyPolicyUrl
    }
  }
`;

export function useGetSignUpStepInputCredentialsPageQuery(
  options?: Omit<Urql.UseQueryArgs<GetSignUpStepInputCredentialsPageQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetSignUpStepInputCredentialsPageQuery, GetSignUpStepInputCredentialsPageQueryVariables>({
    query: GetSignUpStepInputCredentialsPageDocument,
    ...options,
  });
}
