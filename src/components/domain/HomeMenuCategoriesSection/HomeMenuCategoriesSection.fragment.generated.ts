import gql from 'graphql-tag';
export type HomeMenuCategoriesSectionPartsFragment = {
  __typename: 'MenuCategoriesSection';
  title: string;
  categories: Array<{
    __typename: 'MenuCategory';
    id: string;
    name: string;
    items: {
      __typename: 'MenuItemConnection';
      nodes: Array<{
        __typename: 'MenuItem';
        id: string;
        name: string;
        price: number;
        priceExcludingTax: number;
        image: string;
        status: { __typename: 'MenuItemStatus'; available: boolean; labelUnavailable?: string | null };
      }>;
    };
  }>;
};

export const HomeMenuCategoriesSectionPartsFragmentDoc = gql`
  fragment HomeMenuCategoriesSectionParts on MenuCategoriesSection {
    title
    categories {
      id
      name
      items(orderType: $orderType) {
        nodes {
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
    }
  }
`;
