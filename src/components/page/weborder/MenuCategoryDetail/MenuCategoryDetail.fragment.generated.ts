import gql from 'graphql-tag';
export type MenuCategoryItemsFragment = {
  __typename: 'MenuCategory';
  id: string;
  items: {
    __typename: 'MenuItemConnection';
    nodes: Array<{
      __typename: 'MenuItem';
      id: string;
      name: string;
      description?: string | null;
      price: number;
      priceExcludingTax: number;
      image: string;
      status: { __typename: 'MenuItemStatus'; available: boolean; labelUnavailable?: string | null };
    }>;
    pageInfo: { __typename: 'PageInfo'; hasNextPage: boolean; endCursor?: string | null };
  };
};

export const MenuCategoryItemsFragmentDoc = gql`
  fragment MenuCategoryItems on MenuCategory {
    id
    items(orderType: $orderType, after: $after) {
      nodes {
        id
        name
        description
        price(orderType: $orderType)
        priceExcludingTax(orderType: $orderType)
        image
        status {
          available
          labelUnavailable
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
