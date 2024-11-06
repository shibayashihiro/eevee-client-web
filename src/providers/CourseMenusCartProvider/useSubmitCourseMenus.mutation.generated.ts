import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SubmitCourseMenusMutationVariables = Types.Exact<{
  input: Types.SubmitCourseMenusInput;
}>;

export type SubmitCourseMenusMutation = {
  __typename: 'Mutation';
  submitCourseMenus: {
    __typename: 'SubmitCourseMenusPayload';
    postOrderMessage?: { __typename: 'PostOrderMessage'; title: string; message: string } | null;
  };
};

export const SubmitCourseMenusDocument = gql`
  mutation SubmitCourseMenus($input: SubmitCourseMenusInput!) {
    submitCourseMenus(input: $input) {
      __typename
      postOrderMessage {
        title
        message
      }
    }
  }
`;

export function useSubmitCourseMenusMutation() {
  return Urql.useMutation<SubmitCourseMenusMutation, SubmitCourseMenusMutationVariables>(SubmitCourseMenusDocument);
}
