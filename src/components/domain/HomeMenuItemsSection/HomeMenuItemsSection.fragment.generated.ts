import gql from 'graphql-tag';
export type HomeMenuItemsSectionPartsFragment = {
  __typename: 'MenuItemsSection';
  title: string;
  items: Array<{
    __typename: 'MenuItem';
    id: string;
    name: string;
    price: number;
    priceExcludingTax: number;
    image: string;
    status: { __typename: 'MenuItemStatus'; available: boolean; labelUnavailable?: string | null };
  }>;
};

export const HomeMenuItemsSectionPartsFragmentDoc = gql`
  fragment HomeMenuItemsSectionParts on MenuItemsSection {
    title
    items {
      id
      name
      price(orderType: $orderType)
      priceExcludingTax(orderType: $orderType)
      image
      status {
        available
        labelUnavailable
      }
    }
  }
`;
