import gql from 'graphql-tag';
import * as Urql from 'urql';

import { DateTime } from '@/graphql/generated/types';

import * as Types from '../../../../graphql/generated/types';
import { OrderItemOptionItemsTextPartsFragmentDoc } from '../../../domain/OrderItemOptionItemsText/OrderItemOptionItemsText.fragment.generated';

import { InProgressOrderListItemFragmentDoc } from './InProgressOrderListItem.fragment.generated';
import {
  OrderHistoryListItemFragmentDoc,
  OrderHistoryListItemCompletionStatusFragmentDoc,
} from './OrderHistoryListItem.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetOrderHistoryQueryVariables = Types.Exact<{
  first: Types.Scalars['Int']['input'];
  after?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
}>;

export type GetOrderHistoryQuery = {
  __typename: 'Query';
  viewer: {
    __typename: 'User';
    orders: {
      __typename: 'OrderConnection';
      nodes: Array<
        | {
            __typename: 'DeliveryOrder';
            id: string;
            shortIds: Array<string>;
            facility: { __typename: 'Facility'; shortName: string };
            progress?: { __typename: 'Progress'; scheduledTime: string } | null;
            completionStatus?: { __typename: 'CompletionStatus'; statusLabel: string; completedAt: DateTime } | null;
            items: Array<{
              __typename: 'OrderItem';
              name: string;
              quantity: number;
              selectedOptionItems: Array<{
                __typename: 'OrderOptionItem';
                name: string;
                quantity: number;
                subOptionItems: Array<{ __typename: 'OrderOptionItem'; name: string; quantity: number }>;
              }>;
            }>;
          }
        | {
            __typename: 'EatInOrder';
            id: string;
            shortIds: Array<string>;
            facility: { __typename: 'Facility'; shortName: string };
            progress?: { __typename: 'Progress'; scheduledTime: string } | null;
            items: Array<{
              __typename: 'OrderItem';
              name: string;
              quantity: number;
              selectedOptionItems: Array<{
                __typename: 'OrderOptionItem';
                name: string;
                quantity: number;
                subOptionItems: Array<{ __typename: 'OrderOptionItem'; name: string; quantity: number }>;
              }>;
            }>;
          }
        | {
            __typename: 'TableOrder';
            id: string;
            shortIds: Array<string>;
            facility: { __typename: 'Facility'; shortName: string };
            progress?: { __typename: 'Progress'; scheduledTime: string } | null;
            items: Array<{
              __typename: 'OrderItem';
              name: string;
              quantity: number;
              selectedOptionItems: Array<{
                __typename: 'OrderOptionItem';
                name: string;
                quantity: number;
                subOptionItems: Array<{ __typename: 'OrderOptionItem'; name: string; quantity: number }>;
              }>;
            }>;
          }
        | {
            __typename: 'TakeoutOrder';
            id: string;
            shortIds: Array<string>;
            facility: { __typename: 'Facility'; shortName: string };
            progress?: { __typename: 'Progress'; scheduledTime: string } | null;
            completionStatus?: { __typename: 'CompletionStatus'; statusLabel: string; completedAt: DateTime } | null;
            items: Array<{
              __typename: 'OrderItem';
              name: string;
              quantity: number;
              selectedOptionItems: Array<{
                __typename: 'OrderOptionItem';
                name: string;
                quantity: number;
                subOptionItems: Array<{ __typename: 'OrderOptionItem'; name: string; quantity: number }>;
              }>;
            }>;
          }
      >;
      pageInfo: { __typename: 'PageInfoTimeBased'; hasNextPage: boolean; endCursor?: DateTime | null };
    };
  };
};

export type OrderForHistory_DeliveryOrder_Fragment = {
  __typename: 'DeliveryOrder';
  id: string;
  shortIds: Array<string>;
  facility: { __typename: 'Facility'; shortName: string };
  progress?: { __typename: 'Progress'; scheduledTime: string } | null;
  completionStatus?: { __typename: 'CompletionStatus'; statusLabel: string; completedAt: DateTime } | null;
  items: Array<{
    __typename: 'OrderItem';
    name: string;
    quantity: number;
    selectedOptionItems: Array<{
      __typename: 'OrderOptionItem';
      name: string;
      quantity: number;
      subOptionItems: Array<{ __typename: 'OrderOptionItem'; name: string; quantity: number }>;
    }>;
  }>;
};

export type OrderForHistory_EatInOrder_Fragment = {
  __typename: 'EatInOrder';
  id: string;
  shortIds: Array<string>;
  facility: { __typename: 'Facility'; shortName: string };
  progress?: { __typename: 'Progress'; scheduledTime: string } | null;
  items: Array<{
    __typename: 'OrderItem';
    name: string;
    quantity: number;
    selectedOptionItems: Array<{
      __typename: 'OrderOptionItem';
      name: string;
      quantity: number;
      subOptionItems: Array<{ __typename: 'OrderOptionItem'; name: string; quantity: number }>;
    }>;
  }>;
};

export type OrderForHistory_TableOrder_Fragment = {
  __typename: 'TableOrder';
  id: string;
  shortIds: Array<string>;
  facility: { __typename: 'Facility'; shortName: string };
  progress?: { __typename: 'Progress'; scheduledTime: string } | null;
  items: Array<{
    __typename: 'OrderItem';
    name: string;
    quantity: number;
    selectedOptionItems: Array<{
      __typename: 'OrderOptionItem';
      name: string;
      quantity: number;
      subOptionItems: Array<{ __typename: 'OrderOptionItem'; name: string; quantity: number }>;
    }>;
  }>;
};

export type OrderForHistory_TakeoutOrder_Fragment = {
  __typename: 'TakeoutOrder';
  id: string;
  shortIds: Array<string>;
  facility: { __typename: 'Facility'; shortName: string };
  progress?: { __typename: 'Progress'; scheduledTime: string } | null;
  completionStatus?: { __typename: 'CompletionStatus'; statusLabel: string; completedAt: DateTime } | null;
  items: Array<{
    __typename: 'OrderItem';
    name: string;
    quantity: number;
    selectedOptionItems: Array<{
      __typename: 'OrderOptionItem';
      name: string;
      quantity: number;
      subOptionItems: Array<{ __typename: 'OrderOptionItem'; name: string; quantity: number }>;
    }>;
  }>;
};

export type OrderForHistoryFragment =
  | OrderForHistory_DeliveryOrder_Fragment
  | OrderForHistory_EatInOrder_Fragment
  | OrderForHistory_TableOrder_Fragment
  | OrderForHistory_TakeoutOrder_Fragment;

export const OrderForHistoryFragmentDoc = gql`
  fragment OrderForHistory on Order {
    ...InProgressOrderListItem
    ...OrderHistoryListItem
  }
`;
export const GetOrderHistoryDocument = gql`
  query GetOrderHistory($first: Int!, $after: DateTime) {
    viewer {
      orders(first: $first, after: $after) {
        nodes {
          ...OrderForHistory
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  ${OrderForHistoryFragmentDoc}
  ${InProgressOrderListItemFragmentDoc}
  ${OrderHistoryListItemFragmentDoc}
  ${OrderItemOptionItemsTextPartsFragmentDoc}
  ${OrderHistoryListItemCompletionStatusFragmentDoc}
`;

export function useGetOrderHistoryQuery(options: Omit<Urql.UseQueryArgs<GetOrderHistoryQueryVariables>, 'query'>) {
  return Urql.useQuery<GetOrderHistoryQuery, GetOrderHistoryQueryVariables>({
    query: GetOrderHistoryDocument,
    ...options,
  });
}
