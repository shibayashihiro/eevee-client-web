import gql from 'graphql-tag';

import * as Types from '../../../graphql/generated/types';
export type MenuItemDetailPartsFragment = {
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
};

export const MenuItemDetailPartsFragmentDoc = gql`
  fragment MenuItemDetailParts on MenuItem {
    id
    name
    image
    description
    price(orderType: $orderType)
    ownerComment {
      ...OwnerCommentParts
    }
    orderStatus(orderType: $orderType) {
      viewerCanAddToCart
      reasonViewerCannotAddToCart
    }
    options {
      ...MenuItemDetailOptionParts
    }
    taxRateType
    ...MenuItemForCartItemEditParts
  }
`;
