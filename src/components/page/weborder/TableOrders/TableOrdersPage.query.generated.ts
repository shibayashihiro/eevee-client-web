import gql from 'graphql-tag';
import * as Urql from 'urql';

import { DateTime } from '@/graphql/generated/types';

import * as Types from '../../../../graphql/generated/types';
import { TableNumberMainHeaderPartsFragmentDoc } from '../../../domain/TableNumberMainHeader/TableNumberMainHeader.fragment.generated';
import { CartMenuItemFragmentDoc } from '../../../domain/CartMenuItem/CartMenuItem.fragment.generated';
import { OrderItemOptionItemsTextPartsFragmentDoc } from '../../../domain/OrderItemOptionItemsText/OrderItemOptionItemsText.fragment.generated';
import { CartCourseMenuItemFragmentDoc } from '../../../domain/CartCourseMenuItem/CartCourseMenuItem.fragment.generated';
import { ChargeDetailsFullListPartsFragmentDoc } from '../../../domain/ChargeDetailsFullList/ChargeDetailsFullList.fragment.generated';
import { FeatureFlagsForProviderFragmentDoc } from '../../../../providers/FeatureFlagsProvider/FeatureFlagsProvider.fragment.generated';

import {
  TableOrdersPageOrderListPartsFragmentDoc,
  TableOrdersPageOrderListItemPartsFragmentDoc,
  CourseMenuPartsFragmentDoc,
} from './OrderList.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type TableOrdersPageQueryQueryVariables = Types.Exact<{
  facilityID: Types.Scalars['ID']['input'];
}>;

export type TableOrdersPageQueryQuery = {
  __typename: 'Query';
  viewer: {
    __typename: 'User';
    table?: {
      __typename: 'Table';
      name: string;
      charge?: {
        __typename: 'Charge';
        amount: number;
        details: Array<{ __typename: 'ChargeDetail'; name: string; amount: number }>;
      } | null;
      orders: Array<{
        __typename: 'TableOrder';
        id: string;
        submittedAt?: DateTime | null;
        progress?: { __typename: 'Progress'; prepared: boolean } | null;
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
      }>;
      mainCourseMenu?: {
        __typename: 'TableCourseMenu';
        courseMenu: { __typename: 'CourseMenu'; id: string; name: string };
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
      } | null;
      subCourseMenus: Array<{
        __typename: 'TableCourseMenu';
        courseMenu: { __typename: 'CourseMenu'; id: string; name: string };
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
      }>;
    } | null;
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

export const TableOrdersPageQueryDocument = gql`
  query TableOrdersPageQuery($facilityID: ID!) {
    viewer {
      table(facilityID: $facilityID) {
        ...TableNumberMainHeaderParts
        ...TableOrdersPageOrderListParts
        charge {
          ...ChargeDetailsFullListParts
        }
      }
    }
    facility: node(id: $facilityID) {
      ... on Facility {
        featureFlags {
          showPriceExcludingTax
          ...FeatureFlagsForProvider
        }
      }
    }
  }
  ${TableNumberMainHeaderPartsFragmentDoc}
  ${TableOrdersPageOrderListPartsFragmentDoc}
  ${TableOrdersPageOrderListItemPartsFragmentDoc}
  ${CartMenuItemFragmentDoc}
  ${OrderItemOptionItemsTextPartsFragmentDoc}
  ${CourseMenuPartsFragmentDoc}
  ${CartCourseMenuItemFragmentDoc}
  ${ChargeDetailsFullListPartsFragmentDoc}
  ${FeatureFlagsForProviderFragmentDoc}
`;

export function useTableOrdersPageQueryQuery(
  options: Omit<Urql.UseQueryArgs<TableOrdersPageQueryQueryVariables>, 'query'>,
) {
  return Urql.useQuery<TableOrdersPageQueryQuery, TableOrdersPageQueryQueryVariables>({
    query: TableOrdersPageQueryDocument,
    ...options,
  });
}
