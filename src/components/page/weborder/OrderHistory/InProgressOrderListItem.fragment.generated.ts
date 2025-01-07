import gql from 'graphql-tag';
export type InProgressOrderListItem_DeliveryOrder_Fragment = {
  __typename: 'DeliveryOrder';
  id: string;
  shortIds: Array<string>;
  facility: { __typename: 'Facility'; shortName: string };
  progress?: { __typename: 'Progress'; scheduledTime: string } | null;
};

export type InProgressOrderListItem_EatInOrder_Fragment = {
  __typename: 'EatInOrder';
  id: string;
  shortIds: Array<string>;
  facility: { __typename: 'Facility'; shortName: string };
  progress?: { __typename: 'Progress'; scheduledTime: string } | null;
};

export type InProgressOrderListItem_TableOrder_Fragment = {
  __typename: 'TableOrder';
  id: string;
  shortIds: Array<string>;
  facility: { __typename: 'Facility'; shortName: string };
  progress?: { __typename: 'Progress'; scheduledTime: string } | null;
};

export type InProgressOrderListItem_TakeoutOrder_Fragment = {
  __typename: 'TakeoutOrder';
  id: string;
  shortIds: Array<string>;
  facility: { __typename: 'Facility'; shortName: string };
  progress?: { __typename: 'Progress'; scheduledTime: string } | null;
};

export type InProgressOrderListItemFragment =
  | InProgressOrderListItem_DeliveryOrder_Fragment
  | InProgressOrderListItem_EatInOrder_Fragment
  | InProgressOrderListItem_TableOrder_Fragment
  | InProgressOrderListItem_TakeoutOrder_Fragment;

export const InProgressOrderListItemFragmentDoc = gql`
  fragment InProgressOrderListItem on Order {
    id
    facility {
      shortName
    }
    progress {
      scheduledTime
    }
    shortIds
  }
`;
