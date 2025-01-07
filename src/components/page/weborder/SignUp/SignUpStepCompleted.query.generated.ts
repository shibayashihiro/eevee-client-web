import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetSignUpCompletedPageQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetSignUpCompletedPageQuery = {
  __typename: 'Query';
  tenant: {
    __typename: 'Tenant';
    idProviderName: string;
    accountRegistrationIncentives: Array<{ __typename: 'AccountRegistrationIncentive' }>;
  };
};

export const GetSignUpCompletedPageDocument = gql`
  query GetSignUpCompletedPage {
    tenant: viewing {
      idProviderName
      accountRegistrationIncentives {
        __typename
      }
    }
  }
`;

export function useGetSignUpCompletedPageQuery(
  options?: Omit<Urql.UseQueryArgs<GetSignUpCompletedPageQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetSignUpCompletedPageQuery, GetSignUpCompletedPageQueryVariables>({
    query: GetSignUpCompletedPageDocument,
    ...options,
  });
}
