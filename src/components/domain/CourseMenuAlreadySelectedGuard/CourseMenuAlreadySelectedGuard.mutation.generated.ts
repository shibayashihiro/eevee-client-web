import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type CheckInTableWhenCourseMenuAlreadySelectedMutationVariables = Types.Exact<{
  input: Types.CheckInTableInput;
}>;

export type CheckInTableWhenCourseMenuAlreadySelectedMutation = {
  __typename: 'Mutation';
  checkInTable: { __typename: 'CheckInTablePayload'; clientMutationId?: string | null };
};

export const CheckInTableWhenCourseMenuAlreadySelectedDocument = gql`
  mutation CheckInTableWhenCourseMenuAlreadySelected($input: CheckInTableInput!) {
    checkInTable(input: $input) {
      clientMutationId
    }
  }
`;

export function useCheckInTableWhenCourseMenuAlreadySelectedMutation() {
  return Urql.useMutation<
    CheckInTableWhenCourseMenuAlreadySelectedMutation,
    CheckInTableWhenCourseMenuAlreadySelectedMutationVariables
  >(CheckInTableWhenCourseMenuAlreadySelectedDocument);
}
