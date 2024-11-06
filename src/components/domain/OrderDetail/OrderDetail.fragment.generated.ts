import gql from 'graphql-tag';

export type OrderDetailParts_DeliveryOrder_Fragment = {
  __typename: 'DeliveryOrder';
  shortIds: Array<string>;
  deliveryAddress: {
    __typename: 'DeliveryAddress';
    prefecture: string;
    addressLine: string;
    buildingName: string;
    roomNumber: string;
    memo?: string | null;
  };
  charge: {
    __typename: 'Charge';
    amount: number;
    details: Array<{ __typename: 'ChargeDetail'; name: string; amount: number }>;
  };
  items: Array<{
    __typename: 'OrderItem';
    id: string;
    totalPrice: number;
    quantity: number;
    menuItem: { __typename: 'MenuItem'; id: string; name: string; alcoholicBeverage: boolean };
    selectedOptionItems: Array<{
      __typename: 'OrderOptionItem';
      name: string;
      quantity: number;
      subOptionItems: Array<{ __typename: 'OrderOptionItem'; name: string; quantity: number }>;
    }>;
  }>;
  facility: {
    __typename: 'Facility';
    name: string;
    latLng: { __typename: 'LatLng'; latitude: number; longitude: number };
  };
};

export type OrderDetailParts_EatInOrder_Fragment = {
  __typename: 'EatInOrder';
  shortIds: Array<string>;
  charge: {
    __typename: 'Charge';
    amount: number;
    details: Array<{ __typename: 'ChargeDetail'; name: string; amount: number }>;
  };
  items: Array<{
    __typename: 'OrderItem';
    id: string;
    totalPrice: number;
    quantity: number;
    menuItem: { __typename: 'MenuItem'; id: string; name: string; alcoholicBeverage: boolean };
    selectedOptionItems: Array<{
      __typename: 'OrderOptionItem';
      name: string;
      quantity: number;
      subOptionItems: Array<{ __typename: 'OrderOptionItem'; name: string; quantity: number }>;
    }>;
  }>;
  facility: {
    __typename: 'Facility';
    name: string;
    latLng: { __typename: 'LatLng'; latitude: number; longitude: number };
  };
};

export type OrderDetailParts_TableOrder_Fragment = {
  __typename: 'TableOrder';
  shortIds: Array<string>;
  charge: {
    __typename: 'Charge';
    amount: number;
    details: Array<{ __typename: 'ChargeDetail'; name: string; amount: number }>;
  };
  items: Array<{
    __typename: 'OrderItem';
    id: string;
    totalPrice: number;
    quantity: number;
    menuItem: { __typename: 'MenuItem'; id: string; name: string; alcoholicBeverage: boolean };
    selectedOptionItems: Array<{
      __typename: 'OrderOptionItem';
      name: string;
      quantity: number;
      subOptionItems: Array<{ __typename: 'OrderOptionItem'; name: string; quantity: number }>;
    }>;
  }>;
  facility: {
    __typename: 'Facility';
    name: string;
    latLng: { __typename: 'LatLng'; latitude: number; longitude: number };
  };
};

export type OrderDetailParts_TakeoutOrder_Fragment = {
  __typename: 'TakeoutOrder';
  shortIds: Array<string>;
  charge: {
    __typename: 'Charge';
    amount: number;
    details: Array<{ __typename: 'ChargeDetail'; name: string; amount: number }>;
  };
  items: Array<{
    __typename: 'OrderItem';
    id: string;
    totalPrice: number;
    quantity: number;
    menuItem: { __typename: 'MenuItem'; id: string; name: string; alcoholicBeverage: boolean };
    selectedOptionItems: Array<{
      __typename: 'OrderOptionItem';
      name: string;
      quantity: number;
      subOptionItems: Array<{ __typename: 'OrderOptionItem'; name: string; quantity: number }>;
    }>;
  }>;
  facility: {
    __typename: 'Facility';
    name: string;
    latLng: { __typename: 'LatLng'; latitude: number; longitude: number };
  };
};

export type OrderDetailPartsFragment =
  | OrderDetailParts_DeliveryOrder_Fragment
  | OrderDetailParts_EatInOrder_Fragment
  | OrderDetailParts_TableOrder_Fragment
  | OrderDetailParts_TakeoutOrder_Fragment;

export const OrderDetailPartsFragmentDoc = gql`
  fragment OrderDetailParts on Order {
    shortIds
    charge {
      amount
      details {
        name
        amount
      }
    }
    items {
      ...CartMenuItem
    }
    facility {
      name
      latLng {
        latitude
        longitude
      }
    }
    ... on DeliveryOrder {
      deliveryAddress {
        prefecture
        addressLine
        buildingName
        roomNumber
        memo
      }
    }
  }
`;
