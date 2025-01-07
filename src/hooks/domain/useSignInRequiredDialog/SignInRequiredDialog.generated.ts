import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetSignInRequiredDialogQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetSignInRequiredDialogQuery = {
  __typename: 'Query';
  viewing: { __typename: 'Tenant'; idProviderName: string };
};

export const GetSignInRequiredDialogDocument = gql`
  query GetSignInRequiredDialog {
    viewing {
      idProviderName
    }
  }
`;

export function useGetSignInRequiredDialogQuery(
  options?: Omit<Urql.UseQueryArgs<GetSignInRequiredDialogQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetSignInRequiredDialogQuery, GetSignInRequiredDialogQueryVariables>({
    query: GetSignInRequiredDialogDocument,
    ...options,
  });
}
