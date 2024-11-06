import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetCustomerAttributesQueryVariables = Types.Exact<{
  facilityID: Types.Scalars['ID']['input'];
}>;

export type GetCustomerAttributesQuery = {
  __typename: 'Query';
  customerAttributes: Array<{
    __typename: 'CustomerAttribute';
    name: string;
    minSelectCount: number;
    details: Array<{ __typename: 'CustomerAttributeDetail'; id: string; name: string }>;
  }>;
};

export const GetCustomerAttributesDocument = gql`
  query GetCustomerAttributes($facilityID: ID!) {
    customerAttributes(facilityId: $facilityID) {
      name
      minSelectCount
      details {
        id
        name
      }
    }
  }
`;

export function useGetCustomerAttributesQuery(
  options: Omit<Urql.UseQueryArgs<GetCustomerAttributesQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetCustomerAttributesQuery, GetCustomerAttributesQueryVariables>({
    query: GetCustomerAttributesDocument,
    ...options,
  });
}
