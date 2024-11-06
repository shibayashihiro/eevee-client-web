import gql from 'graphql-tag';

export type OptionItemSubOptionEditDialogPartsFragment = {
  __typename: 'OptionItem';
  id: string;
  name: string;
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
};

export const OptionItemSubOptionEditDialogPartsFragmentDoc = gql`
  fragment OptionItemSubOptionEditDialogParts on OptionItem {
    id
    name
    subOptions {
      id
      name
      ...OptionIsRequiredChipParts
      items {
        ...SubOptionItemParts
      }
    }
  }
`;
