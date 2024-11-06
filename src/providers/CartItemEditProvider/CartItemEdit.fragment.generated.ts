import gql from 'graphql-tag';

import * as Types from '../../graphql/generated/types';

export type MenuItemForCartItemEditPartsFragment = {
  __typename: 'MenuItem';
  id: string;
  description?: string | null;
  price: number;
  taxRateType: Types.TaxRateType;
  options: Array<{
    __typename: 'MenuItemOption';
    id: string;
    minSelectCount?: number | null;
    maxSelectCount?: number | null;
    maxSelectCountPerItem?: number | null;
    items: Array<{
      __typename: 'OptionItem';
      price?: number | null;
      taxRateType: Types.TaxRateType;
      id: string;
      name: string;
      subOptions: Array<{
        __typename: 'MenuItemOption';
        id: string;
        minSelectCount?: number | null;
        maxSelectCount?: number | null;
        maxSelectCountPerItem?: number | null;
        items: Array<{
          __typename: 'OptionItem';
          price?: number | null;
          taxRateType: Types.TaxRateType;
          id: string;
          name: string;
        }>;
      }>;
    }>;
  }>;
};

export type InitialOrderItemForCartItemEditFragment = {
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
};

export const MenuItemForCartItemEditPartsFragmentDoc = gql`
  fragment MenuItemForCartItemEditParts on MenuItem {
    id
    description
    price(orderType: $orderType)
    taxRateType
    options {
      ...MenuItemOptionForSelectOptions
      items {
        price(orderType: $orderType)
        taxRateType
        subOptions {
          items {
            price(orderType: $orderType)
            taxRateType
          }
          ...MenuItemOptionForSelectOptions
        }
      }
    }
  }
`;
export const InitialOrderItemForCartItemEditFragmentDoc = gql`
  fragment InitialOrderItemForCartItemEdit on OrderItem {
    id
    quantity
    selectedOptionItems {
      optionId
      quantity
      optionItem {
        id
      }
      subOptionItems {
        optionId
        quantity
        optionItem {
          id
        }
      }
    }
  }
`;
