import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UpdateScheduledOrderTimeMutationVariables = Types.Exact<{
  input: Types.UpdateScheduledOrderTimeInput;
}>;

export type UpdateScheduledOrderTimeMutation = {
  __typename: 'Mutation';
  updateScheduledOrderTime: {
    __typename: 'UpdateScheduledOrderTimePayload';
    scheduledOrderTime: { __typename: 'ScheduledOrderTime' };
  };
};

export const UpdateScheduledOrderTimeDocument = gql`
  mutation UpdateScheduledOrderTime($input: UpdateScheduledOrderTimeInput!) {
    updateScheduledOrderTime(input: $input) {
      scheduledOrderTime {
        __typename
      }
    }
  }
`;

export function useUpdateScheduledOrderTimeMutation() {
  return Urql.useMutation<UpdateScheduledOrderTimeMutation, UpdateScheduledOrderTimeMutationVariables>(
    UpdateScheduledOrderTimeDocument,
  );
}
