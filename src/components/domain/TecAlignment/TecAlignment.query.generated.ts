import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetTecAlignmentQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetTecAlignmentQuery = { __typename: 'Query'; tenant: { __typename: 'Tenant'; tecAlignment: boolean } };

export const GetTecAlignmentDocument = gql`
  query GetTecAlignment {
    tenant: viewing {
      tecAlignment
    }
  }
`;

export function useGetTecAlignmentQuery(options?: Omit<Urql.UseQueryArgs<GetTecAlignmentQueryVariables>, 'query'>) {
  return Urql.useQuery<GetTecAlignmentQuery, GetTecAlignmentQueryVariables>({
    query: GetTecAlignmentDocument,
    ...options,
  });
}
