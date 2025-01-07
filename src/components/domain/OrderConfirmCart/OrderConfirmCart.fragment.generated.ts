import gql from 'graphql-tag';

import * as Types from '../../../graphql/generated/types';

export type OrderConfirmCartPartsFragment = {
  __typename: 'Cart';
  availableCouponsCount: number;
  order?:
    | {
        __typename: 'DeliveryOrder';
        memo?: string | null;
        charge: {
          __typename: 'Charge';
          amount: number;
          details: Array<{ __typename: 'ChargeDetail'; name: string; amount: number }>;
        };
        items: Array<{
          __typename: 'OrderItem';
          id: string;
          name: string;
          totalPrice: number;
          quantity: number;
          menuItem: { __typename: 'MenuItem'; id: string; name: string; alcoholicBeverage: boolean };
          selectedOptionItems: Array<{
            __typename: 'OrderOptionItem';
            name: string;
            quantity: number;
            subOptionItems: Array<{ __typename: 'OrderOptionItem'; name: string; quantity: number }>;
          }>;
        }>;
        payment?: {
          __typename: 'Payment';
          paymentType: Types.PaymentType;
          name: string;
          brand: string;
          isSelected: boolean;
          isSignInRequired: boolean;
        } | null;
        coupon?: { __typename: 'Coupon'; id: string; title: string } | null;
        disposableItems: Array<{
          __typename: 'DisposableItem';
          id: string;
          name: string;
          price: number;
          selected: boolean;
        }>;
        paperReceiptRequest?: { __typename: 'PaperReceiptRequest'; needsPaperReceipt: boolean } | null;
        noContactDeliveryOption: { __typename: 'NoContactDeliveryOption'; requestNoContactDelivery: boolean };
      }
    | {
        __typename: 'EatInOrder';
        memo?: string | null;
        charge: {
          __typename: 'Charge';
          amount: number;
          details: Array<{ __typename: 'ChargeDetail'; name: string; amount: number }>;
        };
        items: Array<{
          __typename: 'OrderItem';
          id: string;
          name: string;
          totalPrice: number;
          quantity: number;
          menuItem: { __typename: 'MenuItem'; id: string; name: string; alcoholicBeverage: boolean };
          selectedOptionItems: Array<{
            __typename: 'OrderOptionItem';
            name: string;
            quantity: number;
            subOptionItems: Array<{ __typename: 'OrderOptionItem'; name: string; quantity: number }>;
          }>;
        }>;
        payment?: {
          __typename: 'Payment';
          paymentType: Types.PaymentType;
          name: string;
          brand: string;
          isSelected: boolean;
          isSignInRequired: boolean;
        } | null;
        coupon?: { __typename: 'Coupon'; id: string; title: string } | null;
        disposableItems: Array<{
          __typename: 'DisposableItem';
          id: string;
          name: string;
          price: number;
          selected: boolean;
        }>;
        courseMenuItems: Array<{
          __typename: 'OrderCourseMenuItem';
          id: string;
          quantity: number;
          totalPrice: number;
          courseMenu: {
            __typename: 'CourseMenu';
            id: string;
            name: string;
            category?: { __typename: 'CourseMenuCategory'; name: string } | null;
          };
          entry: { __typename: 'CourseMenuEntry'; id: string; name: string };
        }>;
      }
    | {
        __typename: 'TableOrder';
        memo?: string | null;
        charge: {
          __typename: 'Charge';
          amount: number;
          details: Array<{ __typename: 'ChargeDetail'; name: string; amount: number }>;
        };
        items: Array<{
          __typename: 'OrderItem';
          id: string;
          name: string;
          totalPrice: number;
          quantity: number;
          menuItem: { __typename: 'MenuItem'; id: string; name: string; alcoholicBeverage: boolean };
          selectedOptionItems: Array<{
            __typename: 'OrderOptionItem';
            name: string;
            quantity: number;
            subOptionItems: Array<{ __typename: 'OrderOptionItem'; name: string; quantity: number }>;
          }>;
        }>;
        payment?: {
          __typename: 'Payment';
          paymentType: Types.PaymentType;
          name: string;
          brand: string;
          isSelected: boolean;
          isSignInRequired: boolean;
        } | null;
        coupon?: { __typename: 'Coupon'; id: string; title: string } | null;
        disposableItems: Array<{
          __typename: 'DisposableItem';
          id: string;
          name: string;
          price: number;
          selected: boolean;
        }>;
      }
    | {
        __typename: 'TakeoutOrder';
        memo?: string | null;
        charge: {
          __typename: 'Charge';
          amount: number;
          details: Array<{ __typename: 'ChargeDetail'; name: string; amount: number }>;
        };
        items: Array<{
          __typename: 'OrderItem';
          id: string;
          name: string;
          totalPrice: number;
          quantity: number;
          menuItem: { __typename: 'MenuItem'; id: string; name: string; alcoholicBeverage: boolean };
          selectedOptionItems: Array<{
            __typename: 'OrderOptionItem';
            name: string;
            quantity: number;
            subOptionItems: Array<{ __typename: 'OrderOptionItem'; name: string; quantity: number }>;
          }>;
        }>;
        payment?: {
          __typename: 'Payment';
          paymentType: Types.PaymentType;
          name: string;
          brand: string;
          isSelected: boolean;
          isSignInRequired: boolean;
        } | null;
        coupon?: { __typename: 'Coupon'; id: string; title: string } | null;
        disposableItems: Array<{
          __typename: 'DisposableItem';
          id: string;
          name: string;
          price: number;
          selected: boolean;
        }>;
        paperReceiptRequest?: { __typename: 'PaperReceiptRequest'; needsPaperReceipt: boolean } | null;
      }
    | null;
};

export const OrderConfirmCartPartsFragmentDoc = gql`
  fragment OrderConfirmCartParts on Cart {
    availableCouponsCount
    order {
      ... on Order {
        charge {
          ...ChargeDetailsFullListParts
        }
        items {
          ...CartMenuItem
        }
        memo
        payment {
          paymentType
          ...PaymentItemParts
        }
        coupon {
          id
          title
        }
        disposableItems {
          ...CartDisposableItemParts
        }
      }
      ... on EatInOrder {
        courseMenuItems {
          ...CartCourseMenuItem
        }
      }
      ... on TakeoutOrder {
        paperReceiptRequest {
          ...PaperReceiptRequestSelection
        }
      }
      ... on DeliveryOrder {
        paperReceiptRequest {
          ...PaperReceiptRequestSelection
        }
        noContactDeliveryOption {
          requestNoContactDelivery
        }
      }
    }
  }
`;
