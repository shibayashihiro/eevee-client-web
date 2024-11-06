import gql from 'graphql-tag';
export type OptionItemSelectListItemPartsFragment = {
  __typename: 'OptionItem';
  name: string;
  image?: string | null;
  description?: string | null;
  price?: number | null;
  priceExcludingTax?: number | null;
  status: { __typename: 'OptionItemStatus'; available: boolean; labelUnavailable?: string | null };
};

export const OptionItemSelectListItemPartsFragmentDoc = gql`
  fragment OptionItemSelectListItemParts on OptionItem {
    name
    image
    description
    price(orderType: $orderType)
    priceExcludingTax(orderType: $orderType)
    status {
      available
      labelUnavailable
    }
  }
`;
