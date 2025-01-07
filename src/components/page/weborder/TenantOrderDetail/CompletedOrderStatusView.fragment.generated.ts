import gql from 'graphql-tag';

import { DateTime } from '@/graphql/generated/types';

export type OrderDetailCompletedOrderStatusView_DeliveryOrder_Fragment = {
  __typename: 'DeliveryOrder';
  completionStatus?: { __typename: 'CompletionStatus'; statusLabel: string; completedAt: DateTime } | null;
  facility: { __typename: 'Facility'; shortName: string };
};

export type OrderDetailCompletedOrderStatusView_EatInOrder_Fragment = {
  __typename: 'EatInOrder';
  facility: { __typename: 'Facility'; shortName: string };
};

export type OrderDetailCompletedOrderStatusView_TableOrder_Fragment = {
  __typename: 'TableOrder';
  facility: { __typename: 'Facility'; shortName: string };
};

export type OrderDetailCompletedOrderStatusView_TakeoutOrder_Fragment = {
  __typename: 'TakeoutOrder';
  completionStatus?: { __typename: 'CompletionStatus'; statusLabel: string; completedAt: DateTime } | null;
  facility: { __typename: 'Facility'; shortName: string };
};

export type OrderDetailCompletedOrderStatusViewFragment =
  | OrderDetailCompletedOrderStatusView_DeliveryOrder_Fragment
  | OrderDetailCompletedOrderStatusView_EatInOrder_Fragment
  | OrderDetailCompletedOrderStatusView_TableOrder_Fragment
  | OrderDetailCompletedOrderStatusView_TakeoutOrder_Fragment;

export type OrderDetailCompletionStatusFragment = {
  __typename: 'CompletionStatus';
  statusLabel: string;
  completedAt: DateTime;
};

export const OrderDetailCompletionStatusFragmentDoc = gql`
  fragment OrderDetailCompletionStatus on CompletionStatus {
    statusLabel
    completedAt
  }
`;
export const OrderDetailCompletedOrderStatusViewFragmentDoc = gql`
  fragment OrderDetailCompletedOrderStatusView on Order {
    facility {
      shortName
    }
    ... on TakeoutOrder {
      completionStatus {
        ...OrderDetailCompletionStatus
      }
    }
    ... on DeliveryOrder {
      completionStatus {
        ...OrderDetailCompletionStatus
      }
    }
  }
`;
