import gql from 'graphql-tag';

import { DateTime } from '@/graphql/generated/types';

export type OrderHistoryListItem_DeliveryOrder_Fragment = {
  __typename: 'DeliveryOrder';
  id: string;
  completionStatus?: { __typename: 'CompletionStatus'; statusLabel: string; completedAt: DateTime } | null;
  facility: { __typename: 'Facility'; shortName: string };
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

export type OrderHistoryListItem_EatInOrder_Fragment = {
  __typename: 'EatInOrder';
  id: string;
  facility: { __typename: 'Facility'; shortName: string };
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

export type OrderHistoryListItem_TableOrder_Fragment = {
  __typename: 'TableOrder';
  id: string;
  facility: { __typename: 'Facility'; shortName: string };
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

export type OrderHistoryListItem_TakeoutOrder_Fragment = {
  __typename: 'TakeoutOrder';
  id: string;
  completionStatus?: { __typename: 'CompletionStatus'; statusLabel: string; completedAt: DateTime } | null;
  facility: { __typename: 'Facility'; shortName: string };
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

export type OrderHistoryListItemFragment =
  | OrderHistoryListItem_DeliveryOrder_Fragment
  | OrderHistoryListItem_EatInOrder_Fragment
  | OrderHistoryListItem_TableOrder_Fragment
  | OrderHistoryListItem_TakeoutOrder_Fragment;

export type OrderHistoryListItemCompletionStatusFragment = {
  __typename: 'CompletionStatus';
  statusLabel: string;
  completedAt: DateTime;
};

export const OrderHistoryListItemCompletionStatusFragmentDoc = gql`
  fragment OrderHistoryListItemCompletionStatus on CompletionStatus {
    statusLabel
    completedAt
  }
`;
export const OrderHistoryListItemFragmentDoc = gql`
  fragment OrderHistoryListItem on Order {
    id
    facility {
      shortName
    }
    items {
      name
      quantity
      ...OrderItemOptionItemsTextParts
    }
    ... on DeliveryOrder {
      completionStatus {
        ...OrderHistoryListItemCompletionStatus
      }
    }
    ... on TakeoutOrder {
      completionStatus {
        ...OrderHistoryListItemCompletionStatus
      }
    }
  }
`;
