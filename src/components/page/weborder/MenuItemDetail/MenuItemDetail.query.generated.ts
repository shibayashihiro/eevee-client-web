import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
import {
  NavbarViewingPartsFragmentDoc,
  NavbarViewerPartsFragmentDoc,
  NavbarMenuViewerFragmentDoc,
  NavbarMenuFacilityFragmentDoc,
} from '../../../domain/Navbar/Navbar.fragment.generated';
import { MenuItemDetailPartsFragmentDoc } from '../../../domain/MenuItemDetail/MenuItemDetail.fragment.generated';
import { OwnerCommentPartsFragmentDoc } from '../../../domain/OwnerComment/OwnerComment.fragment.generated';
import { MenuItemDetailOptionPartsFragmentDoc } from '../../../domain/MenuItemDetailOption/MenuItemDetailOption.fragment.generated';
import { OptionIsRequiredChipPartsFragmentDoc } from '../../../domain/OptionIsRequiredChip/OptionIsRequiredChip.fragment.generated';
import { OptionItemSelectListItemPartsFragmentDoc } from '../../../domain/OptionItemSelectListItem/OptionItemSelectListItem.fragment.generated';
import { OptionItemSubOptionEditDialogPartsFragmentDoc } from '../../../domain/OptionItemSubOptionEditDialog/OptionItemSubOptionEditDialog.fragment.generated';
import { SubOptionItemPartsFragmentDoc } from '../../../domain/OptionItemSubOptionEditDialog/SubOptionItem.fragment.generated';
import {
  MenuItemForCartItemEditPartsFragmentDoc,
  InitialOrderItemForCartItemEditFragmentDoc,
} from '../../../../providers/CartItemEditProvider/CartItemEdit.fragment.generated';
import {
  MenuItemOptionForSelectOptionsFragmentDoc,
  MenuItemOptionForValidationPartsFragmentDoc,
} from '../../../../utils/domain/selectMenuOptionsReducer.fragment.generated';
import {
  GeneralNavbarMenuViewerFragmentDoc,
  GeneralNavbarMenuFacilityFragmentDoc,
} from '../../../domain/Navbar/GeneralNavbarMenu.generated';
import { FeatureFlagsForProviderFragmentDoc } from '../../../../providers/FeatureFlagsProvider/FeatureFlagsProvider.fragment.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetMenuItemDetailQueryVariables = Types.Exact<{
  facilityID: Types.Scalars['ID']['input'];
  menuItemID: Types.Scalars['ID']['input'];
  orderType: Types.OrderType;
  withOrderItem: Types.Scalars['Boolean']['input'];
  isEatIn: Types.Scalars['Boolean']['input'];
  orderItemID: Types.Scalars['ID']['input'];
}>;

export type GetMenuItemDetailQuery = {
  __typename: 'Query';
  tenant: { __typename: 'Tenant'; logo: string };
  menuItem?:
    | { __typename: 'Cart' }
    | { __typename: 'Coupon' }
    | { __typename: 'CourseMenu' }
    | { __typename: 'CourseMenuCategory' }
    | { __typename: 'DeliveryOrder' }
    | { __typename: 'EatInOrder' }
    | { __typename: 'Facility' }
    | { __typename: 'MenuCategory' }
    | {
        __typename: 'MenuItem';
        id: string;
        name: string;
        image: string;
        description?: string | null;
        price: number;
        taxRateType: Types.TaxRateType;
        ownerComment?: {
          __typename: 'OwnerComment';
          comment: string;
          owner: { __typename: 'Owner'; name?: string | null; icon: string };
        } | null;
        orderStatus: {
          __typename: 'MenuItemOrderStatus';
          viewerCanAddToCart: boolean;
          reasonViewerCannotAddToCart?: string | null;
        };
        options: Array<{
          __typename: 'MenuItemOption';
          id: string;
          name: string;
          minSelectCount?: number | null;
          maxSelectCount?: number | null;
          maxSelectCountPerItem?: number | null;
          items: Array<{
            __typename: 'OptionItem';
            price?: number | null;
            taxRateType: Types.TaxRateType;
            id: string;
            name: string;
            image?: string | null;
            description?: string | null;
            priceExcludingTax?: number | null;
            subOptions: Array<{
              __typename: 'MenuItemOption';
              id: string;
              name: string;
              minSelectCount?: number | null;
              maxSelectCount?: number | null;
              maxSelectCountPerItem?: number | null;
              items: Array<{
                __typename: 'OptionItem';
                price?: number | null;
                taxRateType: Types.TaxRateType;
                id: string;
                name: string;
                image?: string | null;
                description?: string | null;
                priceExcludingTax?: number | null;
                status: { __typename: 'OptionItemStatus'; available: boolean; labelUnavailable?: string | null };
              }>;
            }>;
            status: { __typename: 'OptionItemStatus'; available: boolean; labelUnavailable?: string | null };
          }>;
        }>;
      }
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
      item?: {
        __typename: 'OrderItem';
        id: string;
        quantity: number;
        selectedOptionItems: Array<{
          __typename: 'OrderOptionItem';
          optionId: string;
          quantity: number;
          optionItem: { __typename: 'OptionItem'; id: string };
          subOptionItems: Array<{
            __typename: 'OrderOptionItem';
            optionId: string;
            quantity: number;
            optionItem: { __typename: 'OptionItem'; id: string };
          }>;
        }>;
      } | null;
    };
    deliveryAddresses: Array<{ __typename: 'DeliveryAddress' }>;
    table?: { __typename: 'Table'; id: string } | null;
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

export const GetMenuItemDetailDocument = gql`
  query GetMenuItemDetail(
    $facilityID: ID!
    $menuItemID: ID!
    $orderType: OrderType!
    $withOrderItem: Boolean!
    $isEatIn: Boolean!
    $orderItemID: ID!
  ) {
    tenant: viewing {
      ...NavbarViewingParts
    }
    menuItem: node(id: $menuItemID) {
      ...MenuItemDetailParts
    }
    viewer {
      cart(facilityID: $facilityID, orderType: $orderType) {
        id
        item(id: $orderItemID) @include(if: $withOrderItem) {
          ...InitialOrderItemForCartItemEdit
        }
      }
      deliveryAddresses {
        __typename
      }
      table(facilityID: $facilityID) @include(if: $isEatIn) {
        id
      }
      ...NavbarViewerParts
    }
    facility: node(id: $facilityID) {
      ... on Facility {
        ...NavbarMenuFacility
        featureFlags {
          ...FeatureFlagsForProvider
        }
      }
    }
  }
  ${NavbarViewingPartsFragmentDoc}
  ${MenuItemDetailPartsFragmentDoc}
  ${OwnerCommentPartsFragmentDoc}
  ${MenuItemDetailOptionPartsFragmentDoc}
  ${OptionIsRequiredChipPartsFragmentDoc}
  ${OptionItemSelectListItemPartsFragmentDoc}
  ${OptionItemSubOptionEditDialogPartsFragmentDoc}
  ${SubOptionItemPartsFragmentDoc}
  ${MenuItemForCartItemEditPartsFragmentDoc}
  ${MenuItemOptionForSelectOptionsFragmentDoc}
  ${MenuItemOptionForValidationPartsFragmentDoc}
  ${InitialOrderItemForCartItemEditFragmentDoc}
  ${NavbarViewerPartsFragmentDoc}
  ${NavbarMenuViewerFragmentDoc}
  ${GeneralNavbarMenuViewerFragmentDoc}
  ${NavbarMenuFacilityFragmentDoc}
  ${GeneralNavbarMenuFacilityFragmentDoc}
  ${FeatureFlagsForProviderFragmentDoc}
`;

export function useGetMenuItemDetailQuery(options: Omit<Urql.UseQueryArgs<GetMenuItemDetailQueryVariables>, 'query'>) {
  return Urql.useQuery<GetMenuItemDetailQuery, GetMenuItemDetailQueryVariables>({
    query: GetMenuItemDetailDocument,
    ...options,
  });
}
