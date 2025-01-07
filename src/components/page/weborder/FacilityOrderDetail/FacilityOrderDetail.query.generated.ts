import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
import {
  NavbarViewingPartsFragmentDoc,
  NavbarViewerPartsFragmentDoc,
  NavbarMenuViewerFragmentDoc,
  NavbarMenuFacilityFragmentDoc,
} from '../../../domain/Navbar/Navbar.fragment.generated';
import { OrderDetailPartsFragmentDoc } from '../../../domain/OrderDetail/OrderDetail.fragment.generated';
import { OrderDetailOrderItemsSummaryFragmentDoc } from '../../../domain/OrderDetail/OrderItemsSummary.fragment.generated';
import { OrderItemOptionItemsTextPartsFragmentDoc } from '../../../domain/OrderItemOptionItemsText/OrderItemOptionItemsText.fragment.generated';
import { DeliveryOrderProgressDetailPartsFragmentDoc } from '../../../domain/DeliveryOrderProgressDetail/DeliveryOrderProgressDetail.fragment.generated';
import { TakeoutOrderProgressDetailPartsFragmentDoc } from '../../../domain/TakeoutOrderProgressDetail/TakeoutOrderProgressDetail.fragment.generated';
import {
  GeneralNavbarMenuViewerFragmentDoc,
  GeneralNavbarMenuFacilityFragmentDoc,
} from '../../../domain/Navbar/GeneralNavbarMenu.generated';
import { FeatureFlagsForProviderFragmentDoc } from '../../../../providers/FeatureFlagsProvider/FeatureFlagsProvider.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetFacilityOrderDetailQueryVariables = Types.Exact<{
  facilityID: Types.Scalars['ID']['input'];
  orderID: Types.Scalars['ID']['input'];
}>;

export type GetFacilityOrderDetailQuery = {
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
        facility: {
          __typename: 'Facility';
          name: string;
          latLng: { __typename: 'LatLng'; latitude: number; longitude: number };
        };
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
        shortIds: Array<string>;
        facility: {
          __typename: 'Facility';
          name: string;
          latLng: { __typename: 'LatLng'; latitude: number; longitude: number };
        };
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
    | { __typename: 'Facility' }
    | { __typename: 'MenuCategory' }
    | { __typename: 'MenuItem' }
    | { __typename: 'Survey' }
    | { __typename: 'Table' }
    | {
        __typename: 'TableOrder';
        shortIds: Array<string>;
        facility: {
          __typename: 'Facility';
          name: string;
          latLng: { __typename: 'LatLng'; latitude: number; longitude: number };
        };
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
        facility: {
          __typename: 'Facility';
          name: string;
          latLng: { __typename: 'LatLng'; latitude: number; longitude: number };
        };
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
};

export const GetFacilityOrderDetailDocument = gql`
  query GetFacilityOrderDetail($facilityID: ID!, $orderID: ID!) {
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
  ${OrderDetailOrderItemsSummaryFragmentDoc}
  ${OrderItemOptionItemsTextPartsFragmentDoc}
  ${DeliveryOrderProgressDetailPartsFragmentDoc}
  ${TakeoutOrderProgressDetailPartsFragmentDoc}
  ${NavbarViewerPartsFragmentDoc}
  ${NavbarMenuViewerFragmentDoc}
  ${GeneralNavbarMenuViewerFragmentDoc}
  ${NavbarMenuFacilityFragmentDoc}
  ${GeneralNavbarMenuFacilityFragmentDoc}
  ${FeatureFlagsForProviderFragmentDoc}
`;

export function useGetFacilityOrderDetailQuery(
  options: Omit<Urql.UseQueryArgs<GetFacilityOrderDetailQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetFacilityOrderDetailQuery, GetFacilityOrderDetailQueryVariables>({
    query: GetFacilityOrderDetailDocument,
    ...options,
  });
}
