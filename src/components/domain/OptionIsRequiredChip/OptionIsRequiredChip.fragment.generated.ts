import gql from 'graphql-tag';
export type OptionIsRequiredChipPartsFragment = {
  __typename: 'MenuItemOption';
  minSelectCount?: number | null;
  maxSelectCount?: number | null;
  maxSelectCountPerItem?: number | null;
};

export const OptionIsRequiredChipPartsFragmentDoc = gql`
  fragment OptionIsRequiredChipParts on MenuItemOption {
    minSelectCount
    maxSelectCount
    maxSelectCountPerItem
  }
`;
