import gql from 'graphql-tag';
export type CartFooterButtonPartsFragment = { __typename: 'Cart'; totalPrice: number; totalQuantity: number };

export const CartFooterButtonPartsFragmentDoc = gql`
  fragment CartFooterButtonParts on Cart {
    totalPrice
    totalQuantity
  }
`;
