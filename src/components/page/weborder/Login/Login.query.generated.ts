import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetLoginPageQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetLoginPageQuery = {
  __typename: 'Query';
  viewing: {
    __typename: 'Tenant';
    helpUrl: string;
    termsOfUseUrl: string;
    specifiedCommercialTransactionActUrl: string;
    contactUrl: string;
    privacyPolicyUrl: string;
  };
};

export const GetLoginPageDocument = gql`
  query GetLoginPage {
    viewing {
      helpUrl
      termsOfUseUrl
      specifiedCommercialTransactionActUrl
      contactUrl
      privacyPolicyUrl
    }
  }
`;

export function useGetLoginPageQuery(options?: Omit<Urql.UseQueryArgs<GetLoginPageQueryVariables>, 'query'>) {
  return Urql.useQuery<GetLoginPageQuery, GetLoginPageQueryVariables>({ query: GetLoginPageDocument, ...options });
}
