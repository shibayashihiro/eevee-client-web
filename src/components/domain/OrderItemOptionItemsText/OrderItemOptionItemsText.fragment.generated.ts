import gql from 'graphql-tag';
export type OrderItemOptionItemsTextPartsFragment = {
  __typename: 'OrderItem';
  selectedOptionItems: Array<{
    __typename: 'OrderOptionItem';
    name: string;
    quantity: number;
    subOptionItems: Array<{ __typename: 'OrderOptionItem'; name: string; quantity: number }>;
  }>;
};

export const OrderItemOptionItemsTextPartsFragmentDoc = gql`
  fragment OrderItemOptionItemsTextParts on OrderItem {
    selectedOptionItems {
      name
      quantity
      subOptionItems {
        name
        quantity
      }
    }
  }
`;
