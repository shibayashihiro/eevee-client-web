import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetPrivacyPolicyInfoForWebviewQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetPrivacyPolicyInfoForWebviewQuery = {
  __typename: 'Query';
  tenant: { __typename: 'Tenant'; specifiedCommercialTransactionActUrl: string };
};

export const GetPrivacyPolicyInfoForWebviewDocument = gql`
  query GetPrivacyPolicyInfoForWebview {
    tenant: viewing {
      specifiedCommercialTransactionActUrl
    }
  }
`;

export function useGetPrivacyPolicyInfoForWebviewQuery(
  options?: Omit<Urql.UseQueryArgs<GetPrivacyPolicyInfoForWebviewQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetPrivacyPolicyInfoForWebviewQuery, GetPrivacyPolicyInfoForWebviewQueryVariables>({
    query: GetPrivacyPolicyInfoForWebviewDocument,
    ...options,
  });
}
