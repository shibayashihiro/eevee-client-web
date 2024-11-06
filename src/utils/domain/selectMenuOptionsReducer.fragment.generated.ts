import gql from 'graphql-tag';
export type MenuItemOptionForSelectOptionsFragment = {
  __typename: 'MenuItemOption';
  id: string;
  minSelectCount?: number | null;
  maxSelectCount?: number | null;
  maxSelectCountPerItem?: number | null;
  items: Array<{ __typename: 'OptionItem'; id: string; name: string }>;
};

export type MenuItemOptionForValidationPartsFragment = {
  __typename: 'MenuItemOption';
  id: string;
  minSelectCount?: number | null;
  maxSelectCount?: number | null;
  maxSelectCountPerItem?: number | null;
  items: Array<{ __typename: 'OptionItem'; name: string }>;
};

export const MenuItemOptionForValidationPartsFragmentDoc = gql`
  fragment MenuItemOptionForValidationParts on MenuItemOption {
    id
    minSelectCount
    maxSelectCount
    maxSelectCountPerItem
    items {
      name
    }
  }
`;
export const MenuItemOptionForSelectOptionsFragmentDoc = gql`
  fragment MenuItemOptionForSelectOptions on MenuItemOption {
    id
    items {
      id
    }
    ...MenuItemOptionForValidationParts
  }
`;
