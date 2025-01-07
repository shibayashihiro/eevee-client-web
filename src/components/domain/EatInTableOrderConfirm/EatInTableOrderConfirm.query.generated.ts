import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
import { CartFacilityNamePartsFragmentDoc } from '../CartFacilityName/CartFacilityName.fragment.generated';
import { FeatureFlagsForProviderFragmentDoc } from '../../../providers/FeatureFlagsProvider/FeatureFlagsProvider.fragment.generated';
import { BackHomeIfCartEmptyPartsFragmentDoc } from '../../../hooks/domain/useBackHomeIfCartEmpty/useBackHomeIfCartEmpty.generated';
import { OrderConfirmCartPartsFragmentDoc } from '../OrderConfirmCart/OrderConfirmCart.fragment.generated';
import { ChargeDetailsFullListPartsFragmentDoc } from '../ChargeDetailsFullList/ChargeDetailsFullList.fragment.generated';
import { CartMenuItemFragmentDoc } from '../CartMenuItem/CartMenuItem.fragment.generated';
import { OrderItemOptionItemsTextPartsFragmentDoc } from '../OrderItemOptionItemsText/OrderItemOptionItemsText.fragment.generated';
import { PaymentItemPartsFragmentDoc } from '../PaymentItem/PaymentItem.fragment.generated';
import { CartDisposableItemPartsFragmentDoc } from '../CartDisposableItem/CartDisposableItem.fragment.generated';
import { CartCourseMenuItemFragmentDoc } from '../CartCourseMenuItem/CartCourseMenuItem.fragment.generated';
import { PaperReceiptRequestSelectionFragmentDoc } from '../OrderConfirmCart/PaperReceiptRequestSelection.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetCartForEatInTableOrderConfirmQueryVariables = Types.Exact<{
  facilityID: Types.Scalars['ID']['input'];
  orderType: Types.OrderType;
}>;

export type GetCartForEatInTableOrderConfirmQuery = {
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
          OnlinePaymentEnabled: boolean;
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
      tableOrder?:
        | { __typename: 'DeliveryOrder'; id: string }
        | { __typename: 'EatInOrder'; id: string }
        | { __typename: 'TableOrder'; id: string }
        | { __typename: 'TakeoutOrder'; id: string }
        | null;
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
    table?: { __typename: 'Table'; name: string; cartRawId: string } | null;
  };
};

export const GetCartForEatInTableOrderConfirmDocument = gql`
  query GetCartForEatInTableOrderConfirm($facilityID: ID!, $orderType: OrderType!) {
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
        ...BackHomeIfCartEmptyParts
        ...OrderConfirmCartParts
        tableOrder {
          id
        }
      }
      table(facilityID: $facilityID) {
        name
        cartRawId
      }
    }
  }
  ${CartFacilityNamePartsFragmentDoc}
  ${FeatureFlagsForProviderFragmentDoc}
  ${BackHomeIfCartEmptyPartsFragmentDoc}
  ${OrderConfirmCartPartsFragmentDoc}
  ${ChargeDetailsFullListPartsFragmentDoc}
  ${CartMenuItemFragmentDoc}
  ${OrderItemOptionItemsTextPartsFragmentDoc}
  ${PaymentItemPartsFragmentDoc}
  ${CartDisposableItemPartsFragmentDoc}
  ${CartCourseMenuItemFragmentDoc}
  ${PaperReceiptRequestSelectionFragmentDoc}
`;

export function useGetCartForEatInTableOrderConfirmQuery(
  options: Omit<Urql.UseQueryArgs<GetCartForEatInTableOrderConfirmQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetCartForEatInTableOrderConfirmQuery, GetCartForEatInTableOrderConfirmQueryVariables>({
    query: GetCartForEatInTableOrderConfirmDocument,
    ...options,
  });
}
