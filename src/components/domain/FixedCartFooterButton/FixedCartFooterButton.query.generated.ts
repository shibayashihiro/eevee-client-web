import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';

import { CartFooterButtonPartsFragmentDoc } from './FixedCartFooterButton.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetCartForFixedCartFooterButtonQueryVariables = Types.Exact<{
  facilityId: Types.Scalars['ID']['input'];
  orderType: Types.OrderType;
}>;

export type GetCartForFixedCartFooterButtonQuery = {
  __typename: 'Query';
  viewer: { __typename: 'User'; cart: { __typename: 'Cart'; totalPrice: number; totalQuantity: number } };
};

export const GetCartForFixedCartFooterButtonDocument = gql`
  query GetCartForFixedCartFooterButton($facilityId: ID!, $orderType: OrderType!) {
    viewer {
      cart(facilityID: $facilityId, orderType: $orderType) {
        ...CartFooterButtonParts
      }
    }
  }
  ${CartFooterButtonPartsFragmentDoc}
`;

export function useGetCartForFixedCartFooterButtonQuery(
  options: Omit<Urql.UseQueryArgs<GetCartForFixedCartFooterButtonQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetCartForFixedCartFooterButtonQuery, GetCartForFixedCartFooterButtonQueryVariables>({
    query: GetCartForFixedCartFooterButtonDocument,
    ...options,
  });
}
