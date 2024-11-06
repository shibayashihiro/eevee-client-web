import gql from 'graphql-tag';
export type HomeInProgressOrderSectionPartsFragment = {
  __typename: 'InProgressOrderSection';
  orders: Array<
    | {
        __typename: 'DeliveryOrder';
        id: string;
        shortIds: Array<string>;
        progress?: { __typename: 'Progress'; stepSubject: string; scheduledTime: string } | null;
      }
    | {
        __typename: 'EatInOrder';
        id: string;
        shortIds: Array<string>;
        progress?: { __typename: 'Progress'; stepSubject: string; scheduledTime: string } | null;
      }
    | {
        __typename: 'TableOrder';
        id: string;
        shortIds: Array<string>;
        progress?: { __typename: 'Progress'; stepSubject: string; scheduledTime: string } | null;
      }
    | {
        __typename: 'TakeoutOrder';
        id: string;
        shortIds: Array<string>;
        progress?: { __typename: 'Progress'; stepSubject: string; scheduledTime: string } | null;
      }
  >;
};

export const HomeInProgressOrderSectionPartsFragmentDoc = gql`
  fragment HomeInProgressOrderSectionParts on InProgressOrderSection {
    orders {
      id
      shortIds
      progress {
        stepSubject
        scheduledTime
      }
    }
  }
`;
