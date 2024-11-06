import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type CheckInTableFromLineMutationVariables = Types.Exact<{
  input: Types.CheckInTableInput;
}>;

export type CheckInTableFromLineMutation = {
  __typename: 'Mutation';
  checkInTable: { __typename: 'CheckInTablePayload'; clientMutationId?: string | null };
};

export const CheckInTableFromLineDocument = gql`
  mutation CheckInTableFromLINE($input: CheckInTableInput!) {
    checkInTable(input: $input) {
      clientMutationId
    }
  }
`;

export function useCheckInTableFromLineMutation() {
  return Urql.useMutation<CheckInTableFromLineMutation, CheckInTableFromLineMutationVariables>(
    CheckInTableFromLineDocument,
  );
}
