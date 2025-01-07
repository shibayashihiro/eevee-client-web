import gql from 'graphql-tag';

export type CartMenuItemFragment = {
  __typename: 'OrderItem';
  id: string;
  name: string;
  totalPrice: number;
  quantity: number;
  menuItem: { __typename: 'MenuItem'; id: string; name: string; alcoholicBeverage: boolean };
  selectedOptionItems: Array<{
    __typename: 'OrderOptionItem';
    name: string;
    quantity: number;
    subOptionItems: Array<{ __typename: 'OrderOptionItem'; name: string; quantity: number }>;
  }>;
};

export const CartMenuItemFragmentDoc = gql`
  fragment CartMenuItem on OrderItem {
    id
    name
    menuItem {
      id
      name
      alcoholicBeverage
    }
    totalPrice
    quantity
    ...OrderItemOptionItemsTextParts
  }
`;
