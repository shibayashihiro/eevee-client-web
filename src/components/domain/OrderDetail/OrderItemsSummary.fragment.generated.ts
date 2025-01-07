import gql from 'graphql-tag';

export type OrderDetailOrderItemsSummary_DeliveryOrder_Fragment = {
  __typename: 'DeliveryOrder';
  items: Array<{
    __typename: 'OrderItem';
    quantity: number;
    name: string;
    totalPrice: number;
    selectedOptionItems: Array<{
      __typename: 'OrderOptionItem';
      name: string;
      quantity: number;
      subOptionItems: Array<{ __typename: 'OrderOptionItem'; name: string; quantity: number }>;
    }>;
  }>;
  charge: {
    __typename: 'Charge';
    amount: number;
    details: Array<{ __typename: 'ChargeDetail'; name: string; amount: number }>;
  };
};

export type OrderDetailOrderItemsSummary_EatInOrder_Fragment = {
  __typename: 'EatInOrder';
  items: Array<{
    __typename: 'OrderItem';
    quantity: number;
    name: string;
    totalPrice: number;
    selectedOptionItems: Array<{
      __typename: 'OrderOptionItem';
      name: string;
      quantity: number;
      subOptionItems: Array<{ __typename: 'OrderOptionItem'; name: string; quantity: number }>;
    }>;
  }>;
  charge: {
    __typename: 'Charge';
    amount: number;
    details: Array<{ __typename: 'ChargeDetail'; name: string; amount: number }>;
  };
};

export type OrderDetailOrderItemsSummary_TableOrder_Fragment = {
  __typename: 'TableOrder';
  items: Array<{
    __typename: 'OrderItem';
    quantity: number;
    name: string;
    totalPrice: number;
    selectedOptionItems: Array<{
      __typename: 'OrderOptionItem';
      name: string;
      quantity: number;
      subOptionItems: Array<{ __typename: 'OrderOptionItem'; name: string; quantity: number }>;
    }>;
  }>;
  charge: {
    __typename: 'Charge';
    amount: number;
    details: Array<{ __typename: 'ChargeDetail'; name: string; amount: number }>;
  };
};

export type OrderDetailOrderItemsSummary_TakeoutOrder_Fragment = {
  __typename: 'TakeoutOrder';
  items: Array<{
    __typename: 'OrderItem';
    quantity: number;
    name: string;
    totalPrice: number;
    selectedOptionItems: Array<{
      __typename: 'OrderOptionItem';
      name: string;
      quantity: number;
      subOptionItems: Array<{ __typename: 'OrderOptionItem'; name: string; quantity: number }>;
    }>;
  }>;
  charge: {
    __typename: 'Charge';
    amount: number;
    details: Array<{ __typename: 'ChargeDetail'; name: string; amount: number }>;
  };
};

export type OrderDetailOrderItemsSummaryFragment =
  | OrderDetailOrderItemsSummary_DeliveryOrder_Fragment
  | OrderDetailOrderItemsSummary_EatInOrder_Fragment
  | OrderDetailOrderItemsSummary_TableOrder_Fragment
  | OrderDetailOrderItemsSummary_TakeoutOrder_Fragment;

export const OrderDetailOrderItemsSummaryFragmentDoc = gql`
  fragment OrderDetailOrderItemsSummary on Order {
    items {
      quantity
      name
      totalPrice
      ...OrderItemOptionItemsTextParts
    }
    charge {
      details {
        name
        amount
      }
      amount
    }
  }
`;
