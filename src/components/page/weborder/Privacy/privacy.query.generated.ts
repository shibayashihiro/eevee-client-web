import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetPrivacyPageDataQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetPrivacyPageDataQuery = {
  __typename: 'Query';
  viewing: {
    __typename: 'Tenant';
    specifiedCommercialTransactionActUrl: string;
    lineAppName: string;
    companyName: string;
    companyAddress: string;
  };
};

export const GetPrivacyPageDataDocument = gql`
  query GetPrivacyPageData {
    viewing {
      specifiedCommercialTransactionActUrl
      lineAppName
      companyName
      companyAddress
    }
  }
`;

export function useGetPrivacyPageDataQuery(
  options?: Omit<Urql.UseQueryArgs<GetPrivacyPageDataQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetPrivacyPageDataQuery, GetPrivacyPageDataQueryVariables>({
    query: GetPrivacyPageDataDocument,
    ...options,
  });
}
