import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetScheduledOrderTimeListQueryVariables = Types.Exact<{
  facilityID: Types.Scalars['ID']['input'];
  orderType: Types.OrderType;
}>;

export type GetScheduledOrderTimeListQuery = {
  __typename: 'Query';
  scheduledOrderTimes: Array<{
    __typename: 'ScheduledOrderTime';
    name: string;
    available: boolean;
    selected: boolean;
    type: Types.ScheduledOrderTimeType;
    items: Array<{
      __typename: 'ScheduledOrderTimeItem';
      name: string;
      minArrival: string;
      maxArrival: string;
      selected: boolean;
    }>;
  }>;
};

export const GetScheduledOrderTimeListDocument = gql`
  query GetScheduledOrderTimeList($facilityID: ID!, $orderType: OrderType!) {
    scheduledOrderTimes(facilityId: $facilityID, orderType: $orderType) {
      name
      available
      selected
      type
      items {
        name
        minArrival
        maxArrival
        selected
      }
    }
  }
`;

export function useGetScheduledOrderTimeListQuery(
  options: Omit<Urql.UseQueryArgs<GetScheduledOrderTimeListQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetScheduledOrderTimeListQuery, GetScheduledOrderTimeListQueryVariables>({
    query: GetScheduledOrderTimeListDocument,
    ...options,
  });
}
