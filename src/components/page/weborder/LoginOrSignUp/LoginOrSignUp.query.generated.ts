import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetLoginOrSignUpPageQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetLoginOrSignUpPageQuery = {
  __typename: 'Query';
  tenant: { __typename: 'Tenant'; idProviderName: string };
};

export const GetLoginOrSignUpPageDocument = gql`
  query GetLoginOrSignUpPage {
    tenant: viewing {
      idProviderName
    }
  }
`;

export function useGetLoginOrSignUpPageQuery(
  options?: Omit<Urql.UseQueryArgs<GetLoginOrSignUpPageQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetLoginOrSignUpPageQuery, GetLoginOrSignUpPageQueryVariables>({
    query: GetLoginOrSignUpPageDocument,
    ...options,
  });
}
