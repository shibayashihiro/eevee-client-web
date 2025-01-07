import gql from 'graphql-tag';
export type InProgressOrderStatusViewDeliveryFragment = {
  __typename: 'DeliveryOrder';
  id: string;
  shortIds: Array<string>;
  progress?: { __typename: 'Progress'; scheduledTime: string } | null;
  facility: { __typename: 'Facility'; shortName: string; phoneNumber: string };
  deliveryAddress: {
    __typename: 'DeliveryAddress';
    prefecture: string;
    addressLine: string;
    buildingName: string;
    roomNumber: string;
  };
  noContactDeliveryOption: { __typename: 'NoContactDeliveryOption'; requestNoContactDelivery: boolean };
};

export const InProgressOrderStatusViewDeliveryFragmentDoc = gql`
  fragment InProgressOrderStatusViewDelivery on DeliveryOrder {
    id
    shortIds
    progress {
      scheduledTime
    }
    facility {
      shortName
      phoneNumber
    }
    deliveryAddress {
      prefecture
      addressLine
      buildingName
      roomNumber
    }
    noContactDeliveryOption {
      requestNoContactDelivery
    }
  }
`;
