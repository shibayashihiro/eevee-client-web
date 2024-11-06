import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetScheduledOrderTimeListByDateQueryVariables = Types.Exact<{
  facilityID: Types.Scalars['ID']['input'];
  orderType: Types.OrderType;
  date: Types.DateInput;
}>;

export type GetScheduledOrderTimeListByDateQuery = {
  __typename: 'Query';
  scheduledOrderTimesByDate: Array<{
    __typename: 'ScheduledOrderTimeItem';
    name: string;
    minArrival: string;
    maxArrival: string;
    selected: boolean;
    disabled: boolean;
  }>;
};

export type GetScheduleOrderAvailableDatesQueryVariables = Types.Exact<{
  facilityID: Types.Scalars['ID']['input'];
  orderType: Types.OrderType;
}>;

export type GetScheduleOrderAvailableDatesQuery = {
  __typename: 'Query';
  scheduleOrderAvailableDates: Array<{ __typename: 'AvailableDate'; year: number; month: number; days: Array<number> }>;
};

export const GetScheduledOrderTimeListByDateDocument = gql`
  query GetScheduledOrderTimeListByDate($facilityID: ID!, $orderType: OrderType!, $date: DateInput!) {
    scheduledOrderTimesByDate(facilityId: $facilityID, orderType: $orderType, date: $date) {
      name
      minArrival
      maxArrival
      selected
      disabled
    }
  }
`;

export function useGetScheduledOrderTimeListByDateQuery(
  options: Omit<Urql.UseQueryArgs<GetScheduledOrderTimeListByDateQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetScheduledOrderTimeListByDateQuery, GetScheduledOrderTimeListByDateQueryVariables>({
    query: GetScheduledOrderTimeListByDateDocument,
    ...options,
  });
}
export const GetScheduleOrderAvailableDatesDocument = gql`
  query GetScheduleOrderAvailableDates($facilityID: ID!, $orderType: OrderType!) {
    scheduleOrderAvailableDates(facilityId: $facilityID, orderType: $orderType) {
      year
      month
      days
    }
  }
`;

export function useGetScheduleOrderAvailableDatesQuery(
  options: Omit<Urql.UseQueryArgs<GetScheduleOrderAvailableDatesQueryVariables>, 'query'>,
) {
  return Urql.useQuery<GetScheduleOrderAvailableDatesQuery, GetScheduleOrderAvailableDatesQueryVariables>({
    query: GetScheduleOrderAvailableDatesDocument,
    ...options,
  });
}
