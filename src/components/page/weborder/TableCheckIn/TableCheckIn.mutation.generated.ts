import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type CheckInTableMutationVariables = Types.Exact<{
  input: Types.CheckInTableInput;
}>;

export type CheckInTableMutation = {
  __typename: 'Mutation';
  checkInTable: { __typename: 'CheckInTablePayload'; clientMutationId?: string | null };
};

export const CheckInTableDocument = gql`
  mutation CheckInTable($input: CheckInTableInput!) {
    checkInTable(input: $input) {
      clientMutationId
    }
  }
`;

export function useCheckInTableMutation() {
  return Urql.useMutation<CheckInTableMutation, CheckInTableMutationVariables>(CheckInTableDocument);
}
