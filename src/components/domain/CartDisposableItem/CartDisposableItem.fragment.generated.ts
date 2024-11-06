import gql from 'graphql-tag';
export type CartDisposableItemPartsFragment = {
  __typename: 'DisposableItem';
  id: string;
  name: string;
  price: number;
  selected: boolean;
};

export const CartDisposableItemPartsFragmentDoc = gql`
  fragment CartDisposableItemParts on DisposableItem {
    id
    name
    price
    selected
  }
`;
