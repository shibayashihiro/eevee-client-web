import gql from 'graphql-tag';
export type BackHomeIfCartEmptyPartsFragment = { __typename: 'Cart'; totalQuantity: number };

export const BackHomeIfCartEmptyPartsFragmentDoc = gql`
  fragment BackHomeIfCartEmptyParts on Cart {
    totalQuantity
  }
`;
