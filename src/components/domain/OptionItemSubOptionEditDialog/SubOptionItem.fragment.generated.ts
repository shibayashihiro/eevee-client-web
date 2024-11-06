import gql from 'graphql-tag';

export type SubOptionItemPartsFragment = {
  __typename: 'OptionItem';
  id: string;
  name: string;
  image?: string | null;
  description?: string | null;
  price?: number | null;
  priceExcludingTax?: number | null;
  status: { __typename: 'OptionItemStatus'; available: boolean; labelUnavailable?: string | null };
};

export const SubOptionItemPartsFragmentDoc = gql`
  fragment SubOptionItemParts on OptionItem {
    id
    ...OptionItemSelectListItemParts
  }
`;
