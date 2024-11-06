import gql from 'graphql-tag';
export type OptionItemSubOptionPreviewListItemPartsFragment = {
  __typename: 'MenuItemOption';
  id: string;
  name: string;
  items: Array<{ __typename: 'OptionItem'; id: string; name: string; price?: number | null }>;
};

export const OptionItemSubOptionPreviewListItemPartsFragmentDoc = gql`
  fragment OptionItemSubOptionPreviewListItemParts on MenuItemOption {
    id
    name
    items {
      id
      name
      price(orderType: $orderType)
    }
  }
`;
