import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetCartForRequestPaperReceiptPageQueryVariables = Types.Exact<{
  facilityId: Types.Scalars['ID']['input'];
  orderType: Types.OrderType;
}>;

export type GetCartForRequestPaperReceiptPageQuery = {
  __typename: 'Query';
  viewer: {
    __typename: 'User';
    cart: {
      __typename: 'Cart';
      id: string;
      order?:
        | {
            __typename: 'DeliveryOrder';
            paperReceiptRequest?: { __typename: 'PaperReceiptRequest'; recipientName?: string | null } | null;
          }
        | { __typename: 'EatInOrder' }
        | { __typename: 'TableOrder' }
        | {
            __typename: 'TakeoutOrder';
            paperReceiptRequest?: { __typename: 'PaperReceiptRequest'; recipientName?: string | null } | null;
          }
        | null;
    };
  };
};

export type RequestPaperReceiptFormValueFragment = { __typename: 'PaperReceiptRequest'; recipientName?: string | null };

export const RequestPaperReceiptFormValueFragmentDoc = gql`
  fragment RequestPaperReceiptFormValue on PaperReceiptRequest {
    recipientName
  }
`;
export const GetCartForRequestPaperReceiptPageDocument = gql`
  query GetCartForRequestPaperReceiptPage($facilityId: ID!, $orderType: OrderType!) {
    viewer {
      cart(facilityID: $facilityId, orderType: $orderType) {
        id
        order {
          ... on TakeoutOrder {
            paperReceiptRequest {
              ...RequestPaperReceiptFormValue
            }
          }
          ... on DeliveryOrder {
            paperReceiptRequest {
              ...RequestPaperReceiptFormValue
            }
          }
        }
      }
    }
  }
  ${RequestPaperReceiptFormValueFragmentDoc}
`;

export function useGetCartForRequestPaperReceiptPageQuery(
  options: Omit<Urql.UseQueryArgs<GetCartForRequestPaperReceiptPageQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetCartForRequestPaperReceiptPageQuery, GetCartForRequestPaperReceiptPageQueryVariables>({
    query: GetCartForRequestPaperReceiptPageDocument,
    ...options,
  });
}
