import gql from 'graphql-tag';
import * as Urql from 'urql';

import { DateTime } from '@/graphql/generated/types';

import * as Types from '../../../../graphql/generated/types';
import { OrderDetailOrderItemsSummaryFragmentDoc } from '../../../domain/OrderDetail/OrderItemsSummary.fragment.generated';
import { OrderItemOptionItemsTextPartsFragmentDoc } from '../../../domain/OrderItemOptionItemsText/OrderItemOptionItemsText.fragment.generated';

import { InProgressOrderStatusViewTakeoutFragmentDoc } from './InProgressOrderStatusViewTakeout.fragment.generated';
import { InProgressOrderStatusViewDeliveryFragmentDoc } from './InProgressOrderStatusViewDelivery.fragment.generated';
import {
  OrderDetailCompletedOrderStatusViewFragmentDoc,
  OrderDetailCompletionStatusFragmentDoc,
} from './CompletedOrderStatusView.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetTenantOrderDetailQueryVariables = Types.Exact<{
  orderID: Types.Scalars['ID']['input'];
}>;

export type GetTenantOrderDetailQuery = {
  __typename: 'Query';
  order?:
    | { __typename: 'Cart'; id: string }
    | { __typename: 'Coupon'; id: string }
    | { __typename: 'CourseMenu'; id: string }
    | { __typename: 'CourseMenuCategory'; id: string }
    | {
        __typename: 'DeliveryOrder';
        id: string;
        shortIds: Array<string>;
        facility: { __typename: 'Facility'; phoneNumber: string; shortName: string };
        progress?: { __typename: 'Progress'; scheduledTime: string } | null;
        deliveryAddress: {
          __typename: 'DeliveryAddress';
          prefecture: string;
          addressLine: string;
          buildingName: string;
          roomNumber: string;
        };
        noContactDeliveryOption: { __typename: 'NoContactDeliveryOption'; requestNoContactDelivery: boolean };
        completionStatus?: { __typename: 'CompletionStatus'; statusLabel: string; completedAt: DateTime } | null;
        items: Array<{
          __typename: 'OrderItem';
          quantity: number;
          name: string;
          totalPrice: number;
          selectedOptionItems: Array<{
            __typename: 'OrderOptionItem';
            name: string;
            quantity: number;
            subOptionItems: Array<{ __typename: 'OrderOptionItem'; name: string; quantity: number }>;
          }>;
        }>;
        charge: {
          __typename: 'Charge';
          amount: number;
          details: Array<{ __typename: 'ChargeDetail'; name: string; amount: number }>;
        };
      }
    | {
        __typename: 'EatInOrder';
        id: string;
        facility: { __typename: 'Facility'; phoneNumber: string; shortName: string };
        progress?: { __typename: 'Progress'; scheduledTime: string } | null;
        items: Array<{
          __typename: 'OrderItem';
          quantity: number;
          name: string;
          totalPrice: number;
          selectedOptionItems: Array<{
            __typename: 'OrderOptionItem';
            name: string;
            quantity: number;
            subOptionItems: Array<{ __typename: 'OrderOptionItem'; name: string; quantity: number }>;
          }>;
        }>;
        charge: {
          __typename: 'Charge';
          amount: number;
          details: Array<{ __typename: 'ChargeDetail'; name: string; amount: number }>;
        };
      }
    | { __typename: 'Facility'; id: string }
    | { __typename: 'MenuCategory'; id: string }
    | { __typename: 'MenuItem'; id: string }
    | { __typename: 'Survey'; id: string }
    | { __typename: 'Table'; id: string }
    | {
        __typename: 'TableOrder';
        id: string;
        facility: { __typename: 'Facility'; phoneNumber: string; shortName: string };
        progress?: { __typename: 'Progress'; scheduledTime: string } | null;
        items: Array<{
          __typename: 'OrderItem';
          quantity: number;
          name: string;
          totalPrice: number;
          selectedOptionItems: Array<{
            __typename: 'OrderOptionItem';
            name: string;
            quantity: number;
            subOptionItems: Array<{ __typename: 'OrderOptionItem'; name: string; quantity: number }>;
          }>;
        }>;
        charge: {
          __typename: 'Charge';
          amount: number;
          details: Array<{ __typename: 'ChargeDetail'; name: string; amount: number }>;
        };
      }
    | {
        __typename: 'TakeoutOrder';
        id: string;
        shortIds: Array<string>;
        facility: {
          __typename: 'Facility';
          phoneNumber: string;
          name: string;
          shortName: string;
          latLng: { __typename: 'LatLng'; latitude: number; longitude: number };
        };
        progress?: { __typename: 'Progress'; scheduledTime: string; prepared: boolean } | null;
        completionStatus?: { __typename: 'CompletionStatus'; statusLabel: string; completedAt: DateTime } | null;
        items: Array<{
          __typename: 'OrderItem';
          quantity: number;
          name: string;
          totalPrice: number;
          selectedOptionItems: Array<{
            __typename: 'OrderOptionItem';
            name: string;
            quantity: number;
            subOptionItems: Array<{ __typename: 'OrderOptionItem'; name: string; quantity: number }>;
          }>;
        }>;
        charge: {
          __typename: 'Charge';
          amount: number;
          details: Array<{ __typename: 'ChargeDetail'; name: string; amount: number }>;
        };
      }
    | { __typename: 'Tenant'; id: string }
    | { __typename: 'User'; id: string }
    | null;
};

export type OrderForSubmittedDialog_DeliveryOrder_Fragment = {
  __typename: 'DeliveryOrder';
  id: string;
  progress?: { __typename: 'Progress'; scheduledTime: string } | null;
};

export type OrderForSubmittedDialog_EatInOrder_Fragment = {
  __typename: 'EatInOrder';
  id: string;
  progress?: { __typename: 'Progress'; scheduledTime: string } | null;
};

export type OrderForSubmittedDialog_TableOrder_Fragment = {
  __typename: 'TableOrder';
  id: string;
  progress?: { __typename: 'Progress'; scheduledTime: string } | null;
};

export type OrderForSubmittedDialog_TakeoutOrder_Fragment = {
  __typename: 'TakeoutOrder';
  id: string;
  progress?: { __typename: 'Progress'; scheduledTime: string } | null;
};

export type OrderForSubmittedDialogFragment =
  | OrderForSubmittedDialog_DeliveryOrder_Fragment
  | OrderForSubmittedDialog_EatInOrder_Fragment
  | OrderForSubmittedDialog_TableOrder_Fragment
  | OrderForSubmittedDialog_TakeoutOrder_Fragment;

export const OrderForSubmittedDialogFragmentDoc = gql`
  fragment OrderForSubmittedDialog on Order {
    id
    progress {
      scheduledTime
    }
  }
`;
export const GetTenantOrderDetailDocument = gql`
  query GetTenantOrderDetail($orderID: ID!) {
    order: node(id: $orderID) {
      id
      ... on Order {
        facility {
          phoneNumber
        }
        progress {
          __typename
        }
      }
      ... on TakeoutOrder {
        ...InProgressOrderStatusViewTakeout
      }
      ... on DeliveryOrder {
        ...InProgressOrderStatusViewDelivery
      }
      ...OrderDetailCompletedOrderStatusView
      ...OrderDetailOrderItemsSummary
      ...OrderForSubmittedDialog
    }
  }
  ${InProgressOrderStatusViewTakeoutFragmentDoc}
  ${InProgressOrderStatusViewDeliveryFragmentDoc}
  ${OrderDetailCompletedOrderStatusViewFragmentDoc}
  ${OrderDetailCompletionStatusFragmentDoc}
  ${OrderDetailOrderItemsSummaryFragmentDoc}
  ${OrderItemOptionItemsTextPartsFragmentDoc}
  ${OrderForSubmittedDialogFragmentDoc}
`;

export function useGetTenantOrderDetailQuery(
  options: Omit<Urql.UseQueryArgs<GetTenantOrderDetailQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetTenantOrderDetailQuery, GetTenantOrderDetailQueryVariables>({
    query: GetTenantOrderDetailDocument,
    ...options,
  });
}
