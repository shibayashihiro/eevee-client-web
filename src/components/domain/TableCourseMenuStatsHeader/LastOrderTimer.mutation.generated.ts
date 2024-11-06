import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type UpdateUserCourseMenuNoticeStatusMutationVariables = Types.Exact<{
  input: Types.UpdateUserCourseMenuNoticeStatusInput;
}>;

export type UpdateUserCourseMenuNoticeStatusMutation = {
  __typename: 'Mutation';
  updateUserCourseMenuNoticeStatus: {
    __typename: 'UpdateUserCourseMenuNoticeStatusPayload';
    clientMutationId?: string | null;
  };
};

export const UpdateUserCourseMenuNoticeStatusDocument = gql`
  mutation updateUserCourseMenuNoticeStatus($input: UpdateUserCourseMenuNoticeStatusInput!) {
    updateUserCourseMenuNoticeStatus(input: $input) {
      clientMutationId
    }
  }
`;

export function useUpdateUserCourseMenuNoticeStatusMutation() {
  return Urql.useMutation<UpdateUserCourseMenuNoticeStatusMutation, UpdateUserCourseMenuNoticeStatusMutationVariables>(
    UpdateUserCourseMenuNoticeStatusDocument,
  );
}
