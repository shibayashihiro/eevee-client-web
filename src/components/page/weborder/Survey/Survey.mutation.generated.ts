import gql from 'graphql-tag';
import * as Urql from 'urql';

import * as Types from '../../../../graphql/generated/types';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type SendCompletedSurveyMutationVariables = Types.Exact<{
  input: Types.SendCompletedSurveyInput;
}>;

export type SendCompletedSurveyMutation = {
  __typename: 'Mutation';
  sendCompletedSurvey: { __typename: 'SendCompletedSurveyPayload'; clientMutationId?: string | null };
};

export const SendCompletedSurveyDocument = gql`
  mutation SendCompletedSurvey($input: SendCompletedSurveyInput!) {
    sendCompletedSurvey(input: $input) {
      clientMutationId
    }
  }
`;

export function useSendCompletedSurveyMutation() {
  return Urql.useMutation<SendCompletedSurveyMutation, SendCompletedSurveyMutationVariables>(
    SendCompletedSurveyDocument,
  );
}
