import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
import { CartFacilityNamePartsFragmentDoc } from '../CartFacilityName/CartFacilityName.fragment.generated';
import { FeatureFlagsForProviderFragmentDoc } from '../../../providers/FeatureFlagsProvider/FeatureFlagsProvider.fragment.generated';
import { OrderConfirmCartPartsFragmentDoc } from '../OrderConfirmCart/OrderConfirmCart.fragment.generated';
import { ChargeDetailsFullListPartsFragmentDoc } from '../ChargeDetailsFullList/ChargeDetailsFullList.fragment.generated';
import { CartMenuItemFragmentDoc } from '../CartMenuItem/CartMenuItem.fragment.generated';
import { OrderItemOptionItemsTextPartsFragmentDoc } from '../OrderItemOptionItemsText/OrderItemOptionItemsText.fragment.generated';
import { PaymentItemPartsFragmentDoc } from '../PaymentItem/PaymentItem.fragment.generated';
import { CartDisposableItemPartsFragmentDoc } from '../CartDisposableItem/CartDisposableItem.fragment.generated';
import { CartCourseMenuItemFragmentDoc } from '../CartCourseMenuItem/CartCourseMenuItem.fragment.generated';
import { PaymentDialogPartsFragmentDoc } from '../PaymentDialog/PaymentDialog.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetCartForDeliveryOrderConfirmQueryVariables = Types.Exact<{
  facilityID: Types.Scalars['ID']['input'];
  orderType: Types.OrderType;
}>;

export type GetCartForDeliveryOrderConfirmQuery = {
  __typename: 'Query';
  facility?:
    | { __typename: 'Cart' }
    | { __typename: 'Coupon' }
    | { __typename: 'CourseMenu' }
    | { __typename: 'CourseMenuCategory' }
    | { __typename: 'DeliveryOrder' }
    | { __typename: 'EatInOrder' }
    | {
        __typename: 'Facility';
        shortName: string;
        featureFlags: {
          __typename: 'FeatureFlags';
          showPriceExcludingTax: boolean;
          loyaltyProgramEnabled: boolean;
          itemCodeSearchEnabled: boolean;
        };
      }
    | { __typename: 'MenuCategory' }
    | { __typename: 'MenuItem' }
    | { __typename: 'Survey' }
    | { __typename: 'Table' }
    | { __typename: 'TableOrder' }
    | { __typename: 'TakeoutOrder' }
    | { __typename: 'Tenant' }
    | { __typename: 'User' }
    | null;
  viewer: {
    __typename: 'User';
    cart: {
      __typename: 'Cart';
      id: string;
      totalQuantity: number;
      availableCouponsCount: number;
      order?:
        | {
            __typename: 'DeliveryOrder';
            scheduledTime: string;
            requirement?: string | null;
            memo?: string | null;
            id: string;
            deliveryAddress: {
              __typename: 'DeliveryAddress';
              id: string;
              prefecture: string;
              addressLine: string;
              buildingName: string;
              roomNumber: string;
              memo?: string | null;
            };
            availablePayments: Array<{
              __typename: 'Payment';
              id: string;
              last4: string;
              brand: string;
              isSelected: boolean;
              paymentType: Types.PaymentType;
            }>;
            charge: {
              __typename: 'Charge';
              amount: number;
              details: Array<{ __typename: 'ChargeDetail'; name: string; amount: number }>;
            };
            items: Array<{
              __typename: 'OrderItem';
              id: string;
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
              last4: string;
              brand: string;
              isSelected: boolean;
              paymentType: Types.PaymentType;
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
            __typename: 'EatInOrder';
            memo?: string | null;
            id: string;
            charge: {
              __typename: 'Charge';
              amount: number;
              details: Array<{ __typename: 'ChargeDetail'; name: string; amount: number }>;
            };
            items: Array<{
              __typename: 'OrderItem';
              id: string;
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
              last4: string;
              brand: string;
              isSelected: boolean;
              paymentType: Types.PaymentType;
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
            id: string;
            charge: {
              __typename: 'Charge';
              amount: number;
              details: Array<{ __typename: 'ChargeDetail'; name: string; amount: number }>;
            };
            items: Array<{
              __typename: 'OrderItem';
              id: string;
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
              last4: string;
              brand: string;
              isSelected: boolean;
              paymentType: Types.PaymentType;
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
            id: string;
            charge: {
              __typename: 'Charge';
              amount: number;
              details: Array<{ __typename: 'ChargeDetail'; name: string; amount: number }>;
            };
            items: Array<{
              __typename: 'OrderItem';
              id: string;
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
              last4: string;
              brand: string;
              isSelected: boolean;
              paymentType: Types.PaymentType;
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
        | null;
    };
  };
};

export const GetCartForDeliveryOrderConfirmDocument = gql`
  query GetCartForDeliveryOrderConfirm($facilityID: ID!, $orderType: OrderType!) {
    facility: node(id: $facilityID) {
      ... on Facility {
        ...CartFacilityNameParts
        featureFlags {
          ...FeatureFlagsForProvider
        }
      }
    }
    viewer {
      cart(facilityID: $facilityID, orderType: $orderType) {
        id
        totalQuantity
        ...OrderConfirmCartParts
        order {
          id
          ... on DeliveryOrder {
            deliveryAddress {
              id
              prefecture
              addressLine
              buildingName
              roomNumber
              memo
            }
            scheduledTime
            requirement
            availablePayments {
              ...PaymentDialogParts
            }
          }
        }
      }
    }
  }
  ${CartFacilityNamePartsFragmentDoc}
  ${FeatureFlagsForProviderFragmentDoc}
  ${OrderConfirmCartPartsFragmentDoc}
  ${ChargeDetailsFullListPartsFragmentDoc}
  ${CartMenuItemFragmentDoc}
  ${OrderItemOptionItemsTextPartsFragmentDoc}
  ${PaymentItemPartsFragmentDoc}
  ${CartDisposableItemPartsFragmentDoc}
  ${CartCourseMenuItemFragmentDoc}
  ${PaymentDialogPartsFragmentDoc}
`;

export function useGetCartForDeliveryOrderConfirmQuery(
  options: Omit<Urql.UseQueryArgs<GetCartForDeliveryOrderConfirmQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetCartForDeliveryOrderConfirmQuery, GetCartForDeliveryOrderConfirmQueryVariables>({
    query: GetCartForDeliveryOrderConfirmDocument,
    ...options,
  });
}
