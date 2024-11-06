import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetMenuItemByItemCodeQueryVariables = Types.Exact<{
  facilityId: Types.Scalars['ID']['input'];
  itemCode: Types.Scalars['String']['input'];
  orderType: Types.OrderType;
}>;

export type GetMenuItemByItemCodeQuery = { __typename: 'Query'; menuItem: { __typename: 'MenuItem'; id: string } };

export const GetMenuItemByItemCodeDocument = gql`
  query GetMenuItemByItemCode($facilityId: ID!, $itemCode: String!, $orderType: OrderType!) {
    menuItem: menuItemByItemCode(facilityId: $facilityId, itemCode: $itemCode, orderType: $orderType) {
      id
    }
  }
`;

export function useGetMenuItemByItemCodeQuery(
  options: Omit<Urql.UseQueryArgs<GetMenuItemByItemCodeQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetMenuItemByItemCodeQuery, GetMenuItemByItemCodeQueryVariables>({
    query: GetMenuItemByItemCodeDocument,
    ...options,
  });
}
