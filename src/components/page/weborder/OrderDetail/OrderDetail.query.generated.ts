import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
import {
  NavbarViewingPartsFragmentDoc,
  NavbarViewerPartsFragmentDoc,
} from '../../../domain/Navbar/Navbar.fragment.generated';
import { OrderDetailPartsFragmentDoc } from '../../../domain/OrderDetail/OrderDetail.fragment.generated';
import { CartMenuItemFragmentDoc } from '../../../domain/CartMenuItem/CartMenuItem.fragment.generated';
import { OrderItemOptionItemsTextPartsFragmentDoc } from '../../../domain/OrderItemOptionItemsText/OrderItemOptionItemsText.fragment.generated';
import { DeliveryOrderProgressDetailPartsFragmentDoc } from '../../../domain/DeliveryOrderProgressDetail/DeliveryOrderProgressDetail.fragment.generated';
import { TakeoutOrderProgressDetailPartsFragmentDoc } from '../../../domain/TakeoutOrderProgressDetail/TakeoutOrderProgressDetail.fragment.generated';
import {
  NavbarMenuViewerFragmentDoc,
  NavbarMenuFacilityFragmentDoc,
} from '../../../domain/Navbar/NavbarMenu.fragment.generated';
import { FeatureFlagsForProviderFragmentDoc } from '../../../../providers/FeatureFlagsProvider/FeatureFlagsProvider.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetOrderDetailQueryVariables = Types.Exact<{
  facilityID: Types.Scalars['ID']['input'];
  orderID: Types.Scalars['ID']['input'];
}>;

export type GetOrderDetailQuery = {
  __typename: 'Query';
  tenant: { __typename: 'Tenant'; logo: string };
  order?:
    | { __typename: 'Cart' }
    | { __typename: 'Coupon' }
    | { __typename: 'CourseMenu' }
    | { __typename: 'CourseMenuCategory' }
    | {
        __typename: 'DeliveryOrder';
        shortIds: Array<string>;
        progress?: {
          __typename: 'Progress';
          currentStep: number;
          lastStep: number;
          stepSubject: string;
          scheduledTime: string;
          contactType: Types.ContactType;
          tel: string;
          waypointId?: string | null;
          driver?: { __typename: 'Driver'; name: string; selfIntroduction: string; image: string } | null;
        } | null;
        deliveryAddress: {
          __typename: 'DeliveryAddress';
          prefecture: string;
          addressLine: string;
          buildingName: string;
          roomNumber: string;
          memo?: string | null;
        };
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
        facility: {
          __typename: 'Facility';
          name: string;
          latLng: { __typename: 'LatLng'; latitude: number; longitude: number };
        };
      }
    | {
        __typename: 'EatInOrder';
        shortIds: Array<string>;
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
        facility: {
          __typename: 'Facility';
          name: string;
          latLng: { __typename: 'LatLng'; latitude: number; longitude: number };
        };
      }
    | { __typename: 'Facility' }
    | { __typename: 'MenuCategory' }
    | { __typename: 'MenuItem' }
    | { __typename: 'Survey' }
    | { __typename: 'Table' }
    | {
        __typename: 'TableOrder';
        shortIds: Array<string>;
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
        facility: {
          __typename: 'Facility';
          name: string;
          latLng: { __typename: 'LatLng'; latitude: number; longitude: number };
        };
      }
    | {
        __typename: 'TakeoutOrder';
        shortIds: Array<string>;
        progress?: {
          __typename: 'Progress';
          currentStep: number;
          lastStep: number;
          stepSubject: string;
          scheduledTime: string;
          tel: string;
          prepared: boolean;
          caution: string;
        } | null;
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
        facility: {
          __typename: 'Facility';
          name: string;
          latLng: { __typename: 'LatLng'; latitude: number; longitude: number };
        };
      }
    | { __typename: 'Tenant' }
    | { __typename: 'User' }
    | null;
  viewer: {
    __typename: 'User';
    profile?: { __typename: 'Profile'; imageUrl: string } | null;
    loyaltyCard?: { __typename: 'UserLoyaltyCard' } | null;
  };
  facility?:
    | { __typename: 'Cart' }
    | { __typename: 'Coupon' }
    | { __typename: 'CourseMenu' }
    | { __typename: 'CourseMenuCategory' }
    | { __typename: 'DeliveryOrder' }
    | { __typename: 'EatInOrder' }
    | {
        __typename: 'Facility';
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
};

export const GetOrderDetailDocument = gql`
  query GetOrderDetail($facilityID: ID!, $orderID: ID!) {
    tenant: viewing {
      ...NavbarViewingParts
    }
    order: node(id: $orderID) {
      ...OrderDetailParts
      ... on DeliveryOrder {
        progress {
          ...DeliveryOrderProgressDetailParts
        }
      }
      ... on TakeoutOrder {
        progress {
          ...TakeoutOrderProgressDetailParts
        }
      }
    }
    viewer {
      ...NavbarViewerParts
    }
    facility: node(id: $facilityID) {
      ...NavbarMenuFacility
    }
  }
  ${NavbarViewingPartsFragmentDoc}
  ${OrderDetailPartsFragmentDoc}
  ${CartMenuItemFragmentDoc}
  ${OrderItemOptionItemsTextPartsFragmentDoc}
  ${DeliveryOrderProgressDetailPartsFragmentDoc}
  ${TakeoutOrderProgressDetailPartsFragmentDoc}
  ${NavbarViewerPartsFragmentDoc}
  ${NavbarMenuViewerFragmentDoc}
  ${NavbarMenuFacilityFragmentDoc}
  ${FeatureFlagsForProviderFragmentDoc}
`;

export function useGetOrderDetailQuery(options: Omit<Urql.UseQueryArgs<GetOrderDetailQueryVariables>, 'query'>) {
  return Urql.useQuery<GetOrderDetailQuery, GetOrderDetailQueryVariables>({
    query: GetOrderDetailDocument,
    ...options,
  });
}
