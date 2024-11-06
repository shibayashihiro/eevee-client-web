import gql from 'graphql-tag';

export type MenuItemDetailOptionPartsFragment = {
  __typename: 'MenuItemOption';
  id: string;
  name: string;
  minSelectCount?: number | null;
  maxSelectCount?: number | null;
  maxSelectCountPerItem?: number | null;
  items: Array<{
    __typename: 'OptionItem';
    id: string;
    name: string;
    image?: string | null;
    description?: string | null;
    price?: number | null;
    priceExcludingTax?: number | null;
    status: { __typename: 'OptionItemStatus'; available: boolean; labelUnavailable?: string | null };
    subOptions: Array<{
      __typename: 'MenuItemOption';
      id: string;
      name: string;
      minSelectCount?: number | null;
      maxSelectCount?: number | null;
      maxSelectCountPerItem?: number | null;
      items: Array<{
        __typename: 'OptionItem';
        id: string;
        name: string;
        image?: string | null;
        description?: string | null;
        price?: number | null;
        priceExcludingTax?: number | null;
        status: { __typename: 'OptionItemStatus'; available: boolean; labelUnavailable?: string | null };
      }>;
    }>;
  }>;
};

export const MenuItemDetailOptionPartsFragmentDoc = gql`
  fragment MenuItemDetailOptionParts on MenuItemOption {
    id
    name
    ...OptionIsRequiredChipParts
    items {
      id
      ...OptionItemSelectListItemParts
      ...OptionItemSubOptionEditDialogParts
    }
  }
`;
