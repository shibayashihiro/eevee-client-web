import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
import {
  NavbarViewingPartsFragmentDoc,
  NavbarViewerPartsFragmentDoc,
  NavbarMenuViewerFragmentDoc,
} from '../../../domain/Navbar/Navbar.fragment.generated';
import { GeneralNavbarMenuViewerFragmentDoc } from '../../../domain/Navbar/GeneralNavbarMenu.generated';
import { FeatureFlagsForProviderFragmentDoc } from '../../../../providers/FeatureFlagsProvider/FeatureFlagsProvider.fragment.generated';

import { MenuCategoryItemsFragmentDoc } from './MenuCategoryDetail.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetMenuCategoryQueryVariables = Types.Exact<{
  facilityId: Types.Scalars['ID']['input'];
  menuCategoryID: Types.Scalars['ID']['input'];
  orderType: Types.OrderType;
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type GetMenuCategoryQuery = {
  __typename: 'Query';
  viewing: { __typename: 'Tenant'; logo: string };
  viewer: {
    __typename: 'User';
    profile?: { __typename: 'Profile'; imageUrl: string } | null;
    loyaltyCard?: { __typename: 'UserLoyaltyCard' } | null;
  };
  menuCategory?:
    | { __typename: 'Cart' }
    | { __typename: 'Coupon' }
    | { __typename: 'CourseMenu' }
    | { __typename: 'CourseMenuCategory' }
    | { __typename: 'DeliveryOrder' }
    | { __typename: 'EatInOrder' }
    | { __typename: 'Facility' }
    | {
        __typename: 'MenuCategory';
        name: string;
        id: string;
        items: {
          __typename: 'MenuItemConnection';
          nodes: Array<{
            __typename: 'MenuItem';
            id: string;
            name: string;
            description?: string | null;
            price: number;
            priceExcludingTax: number;
            image: string;
            status: { __typename: 'MenuItemStatus'; available: boolean; labelUnavailable?: string | null };
          }>;
          pageInfo: { __typename: 'PageInfo'; hasNextPage: boolean; endCursor?: string | null };
        };
      }
    | { __typename: 'MenuItem' }
    | { __typename: 'Survey' }
    | { __typename: 'Table' }
    | { __typename: 'TableOrder' }
    | { __typename: 'TakeoutOrder' }
    | { __typename: 'Tenant' }
    | { __typename: 'User' }
    | null;
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

export type GetMoreMenuCategoryItemsQueryVariables = Types.Exact<{
  menuCategoryID: Types.Scalars['ID']['input'];
  orderType: Types.OrderType;
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type GetMoreMenuCategoryItemsQuery = {
  __typename: 'Query';
  menuCategory?:
    | { __typename: 'Cart' }
    | { __typename: 'Coupon' }
    | { __typename: 'CourseMenu' }
    | { __typename: 'CourseMenuCategory' }
    | { __typename: 'DeliveryOrder' }
    | { __typename: 'EatInOrder' }
    | { __typename: 'Facility' }
    | {
        __typename: 'MenuCategory';
        id: string;
        items: {
          __typename: 'MenuItemConnection';
          nodes: Array<{
            __typename: 'MenuItem';
            id: string;
            name: string;
            description?: string | null;
            price: number;
            priceExcludingTax: number;
            image: string;
            status: { __typename: 'MenuItemStatus'; available: boolean; labelUnavailable?: string | null };
          }>;
          pageInfo: { __typename: 'PageInfo'; hasNextPage: boolean; endCursor?: string | null };
        };
      }
    | { __typename: 'MenuItem' }
    | { __typename: 'Survey' }
    | { __typename: 'Table' }
    | { __typename: 'TableOrder' }
    | { __typename: 'TakeoutOrder' }
    | { __typename: 'Tenant' }
    | { __typename: 'User' }
    | null;
};

export const GetMenuCategoryDocument = gql`
  query GetMenuCategory($facilityId: ID!, $menuCategoryID: ID!, $orderType: OrderType!, $after: String) {
    viewing {
      ...NavbarViewingParts
    }
    viewer {
      ...NavbarViewerParts
    }
    menuCategory: node(id: $menuCategoryID) {
      ... on MenuCategory {
        name
        ...MenuCategoryItems
      }
    }
    facility: node(id: $facilityId) {
      ... on Facility {
        featureFlags {
          ...FeatureFlagsForProvider
        }
      }
    }
  }
  ${NavbarViewingPartsFragmentDoc}
  ${NavbarViewerPartsFragmentDoc}
  ${NavbarMenuViewerFragmentDoc}
  ${GeneralNavbarMenuViewerFragmentDoc}
  ${MenuCategoryItemsFragmentDoc}
  ${FeatureFlagsForProviderFragmentDoc}
`;

export function useGetMenuCategoryQuery(options: Omit<Urql.UseQueryArgs<GetMenuCategoryQueryVariables>, 'query'>) {
  return Urql.useQuery<GetMenuCategoryQuery, GetMenuCategoryQueryVariables>({
    query: GetMenuCategoryDocument,
    ...options,
  });
}
export const GetMoreMenuCategoryItemsDocument = gql`
  query GetMoreMenuCategoryItems($menuCategoryID: ID!, $orderType: OrderType!, $after: String) {
    menuCategory: node(id: $menuCategoryID) {
      ... on MenuCategory {
        ...MenuCategoryItems
      }
    }
  }
  ${MenuCategoryItemsFragmentDoc}
`;

export function useGetMoreMenuCategoryItemsQuery(
  options: Omit<Urql.UseQueryArgs<GetMoreMenuCategoryItemsQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetMoreMenuCategoryItemsQuery, GetMoreMenuCategoryItemsQueryVariables>({
    query: GetMoreMenuCategoryItemsDocument,
    ...options,
  });
}
