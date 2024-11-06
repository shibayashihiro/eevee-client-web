import gql from 'graphql-tag';
export type ScheduledOrderTimeItemPartsFragment = {
  __typename: 'ScheduledOrderTimeItem';
  name: string;
  minArrival: string;
  maxArrival: string;
  selected: boolean;
};

export const ScheduledOrderTimeItemPartsFragmentDoc = gql`
  fragment ScheduledOrderTimeItemParts on ScheduledOrderTimeItem {
    name
    minArrival
    maxArrival
    selected
  }
`;
